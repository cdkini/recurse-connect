package database

import (
	"database/sql"
	"encoding/json"
	"io"
	"time"

	"github.com/cdkini/recurse-connect/server/models"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

// PostgresDB is our production implementation of the DB interface.
type PostgresDB struct {
	conn *sql.DB
}

func NewPostgresDB(conn *sql.DB) *PostgresDB {
	return &PostgresDB{conn}
}

// Graph methods =======================================================================================================

func (p *PostgresDB) ReadGraph(start time.Time, end time.Time, graph *models.Graph) error {
	recursers, err := p.GetRecurserNodes(start, end)
	if err != nil {
		return err // Comes from a helper method so we don't wrap the error again
	}

	batches := getBatchNodes(recursers)
	edges := getEdges(recursers, batches)

	graph.Recursers = recursers
	graph.Batches = batches
	graph.Edges = edges

	return nil
}

func (p *PostgresDB) GetRecurserNodes(start time.Time, end time.Time) ([]models.RecurserNode, error) {
	rows, err := p.getRecurserNodes(start, end)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recursers []models.RecurserNode
	seen := make(map[int]models.RecurserNode, 0) // Keep track of the Recursers we've evaluated to prevent duplicate nodes

	for rows.Next() {
		var recurser models.RecurserNode

		if err = rows.Scan(
			&recurser.Id, &recurser.Name, &recurser.ProfilePath, &recurser.ImagePath, &recurser.Location,
			&recurser.Company, &recurser.Bio, &recurser.Interests, &recurser.BeforeRc, &recurser.DuringRc,
			&recurser.Email, &recurser.GitHub, &recurser.Twitter, &recurser.BatchName, &recurser.BatchShortName,
			&recurser.StartDate, &recurser.EndDate,
		); err != nil {
			return recursers, errors.Wrap(err, "Could not serialize database row into RecurserNode struct")
		}

		// If we've seen before, update start and end dates of struct
		if p, ok := seen[recurser.Id]; ok {
			updateRecurserNodeDates(&recurser, p)
		}
		seen[recurser.Id] = recurser
	}

	// Take the updated nodes from the map as the final output
	for _, val := range seen {
		recursers = append(recursers, val)
	}

	return recursers, nil
}

func (p *PostgresDB) getRecurserNodes(start time.Time, end time.Time) (*sql.Rows, error) {
	query := `
        SELECT profiles.id, profiles.name, profiles.profile_path, profiles.image_path, locations.name, companies.name,
        profiles.bio, profiles.interests, profiles.before_rc, profiles.during_rc, profiles.email, profiles.github, 
        profiles.twitter, batches.name, batches.short_name, stints.start_date, stints.end_date
        FROM profiles
            LEFT JOIN locations ON profiles.location_id = locations.id
            LEFT JOIN companies ON profiles.company_id = companies.id
            LEFT JOIN stints ON profiles.id = stints.profile_id
            LEFT JOIN batches ON stints.batch_id = batches.id
        WHERE stints.end_date >= $1 AND stints.start_date <= $2
    `
	rows, err := p.conn.Query(query, start, end)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return rows, nil
}

// If we have a node clash, we determine the start and end dates based on mins/maxes
func updateRecurserNodeDates(node *models.RecurserNode, cmp models.RecurserNode) {
	if cmp.StartDate.Before(*node.StartDate) {
		node.StartDate = cmp.StartDate
	}
	if cmp.EndDate.After(*node.EndDate) {
		node.EndDate = cmp.EndDate
	}
}

func getBatchNodes(nodes []models.RecurserNode) []models.BatchNode {
	// Keep track of batches as well as their bounds
	batches := make(map[string]bool, 0)
	startDates := make(map[string]*time.Time, 0)
	endDates := make(map[string]*time.Time, 0)

	for _, node := range nodes {
		name := *node.BatchShortName
		if _, ok := batches[name]; !ok {
			batches[name] = true
			startDates[name] = node.StartDate
			endDates[name] = node.EndDate
		} else {
			if startDates[name].Before(*node.StartDate) {
				startDates[name] = node.StartDate
			}
			if endDates[name].After(*node.EndDate) {
				endDates[name] = node.EndDate
			}
		}
	}

	var batchNodes []models.BatchNode
	counter := -1 // We're using negative integers to represent batches to make the difference between node types easy to compute

	for batch := range batches {
		node := models.BatchNode{
			Id:        counter,
			Name:      batch,
			StartDate: startDates[batch],
			EndDate:   endDates[batch],
		}
		counter--
		batchNodes = append(batchNodes, node)
	}

	return batchNodes
}

func getEdges(recurserNodes []models.RecurserNode, batchNodes []models.BatchNode) []models.Edge {
	var edges []models.Edge

	// Determine connections between batches and batches
	for i := 0; i < len(batchNodes); i++ {
		for j := i + 1; j < len(batchNodes); j++ {
			a := batchNodes[i]
			b := batchNodes[j]
			if overlap := determineOverlap(a.StartDate, a.EndDate, b.StartDate, b.EndDate); overlap > 0 {
				// If overlapping, create two edges A->B and B->A
				edges = append(edges,
					models.Edge{To: a.Id, From: b.Id, Weight: overlap},
					models.Edge{To: b.Id, From: a.Id, Weight: overlap},
				)
			}
		}
	}
	// Determine connections between Recursers and batches
	for _, batch := range batchNodes {
		for _, recurser := range recurserNodes {
			if overlap := determineOverlap(batch.StartDate, batch.EndDate, recurser.StartDate, recurser.EndDate); overlap > 0 {
				edges = append(edges,
					models.Edge{To: batch.Id, From: recurser.Id, Weight: overlap},
					models.Edge{To: recurser.Id, From: batch.Id, Weight: overlap},
				)
			}
		}
	}

	return edges
}

func determineOverlap(startA, endA, startB, endB *time.Time) int {
	diff1 := int(endA.Sub(*startB).Hours() / 24)
	diff2 := int(endB.Sub(*startA).Hours() / 24)
	if diff1 < diff2 {
		return diff1 + 1
	}
	return diff2 + 1
}

// Note methods ========================================================================================================

func (p *PostgresDB) ParseNote(body io.Reader, note *models.Note) error {
	err := json.NewDecoder(body).Decode(note)
	if err != nil {
		return errors.Wrap(err, "Could not decode JSON body of request")
	}
	return nil
}

func (p *PostgresDB) ReadNotes(userId int, notes []*models.Note) error {
	rows, err := p.readNotes(userId)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var note models.Note
		if err = rows.Scan(&note.Id, &note.AuthorId, &note.Title, &note.Date, &note.Content); err != nil {
			return errors.Wrap(err, "Could not serialize database row into Note struct")
		}
		notes = append(notes, &note)
	}

	return nil
}

func (p *PostgresDB) readNotes(userId int) (*sql.Rows, error) {
	query := `SELECT * FROM notes WHERE author=$1`
	rows, err := p.conn.Query(query, userId)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return rows, nil
}

func (p *PostgresDB) PostNote(userId int, note *models.Note) (int, error) {
	var noteId int
	row := p.postNote(userId, note)

	if err := row.Scan(&noteId); err != nil {
		return -1, errors.Wrap(err, "Error occurred when querying the database")
	}
	return noteId, nil
}

func (p *PostgresDB) postNote(userId int, note *models.Note) *sql.Row {
	query := `INSERT INTO notes (author, title, date, content) VALUES ($1, $2, $3, $4) RETURNING id`
	return p.conn.QueryRow(query, userId, note.Title, note.Date, note.Content)
}

func (p *PostgresDB) UpdateNote(noteId int, userId int, note *models.Note) error {
	res, err := p.updateNote(noteId, userId, note)
	if err != nil {
		return err
	}

	if count, err := res.RowsAffected(); count != 1 || err != nil {
		return errors.Wrap(err, "Database query did not impact a single row")
	}
	return nil
}

func (p *PostgresDB) updateNote(noteId int, userId int, note *models.Note) (sql.Result, error) {
	query := `UPDATE notes SET title=$2, date=$3, content=$4 WHERE id=$1 AND author=$2`
	res, err := p.conn.Exec(query, noteId, userId, note.Title, note.Date, note.Content)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return res, nil
}

func (p *PostgresDB) DeleteNote(noteId int, userId int) error {
	res, err := p.deleteNote(noteId, userId)
	if err != nil {
		return err
	}

	if count, err := res.RowsAffected(); count != 1 || err != nil {
		return errors.Wrap(err, "Database query did not impact a single row")
	}
	return nil
}

func (p *PostgresDB) deleteNote(noteId int, userId int) (sql.Result, error) {
	query := `DELETE FROM notes WHERE id=$1 AND author=$2`
	res, err := p.conn.Exec(query, noteId, userId)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return res, nil
}

// Tag methods =========================================================================================================

func (p *PostgresDB) ParseTag(body io.Reader, tag *models.Tag) error {
	err := json.NewDecoder(body).Decode(tag)
	if err != nil {
		return errors.Wrap(err, "Could not decode JSON body of request")
	}
	return nil
}

func (p *PostgresDB) ReadTags(userId int, tags []*models.Tag) error {
	rows, err := p.readTags(userId)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var tag models.Tag
		if err = rows.Scan(&tag.Id, &tag.AuthorId, &tag.Name, &tag.ProfileId, &tag.NoteId); err != nil {
			return errors.Wrap(err, "Could not serialize database row into Tag struct")
		}
		tags = append(tags, &tag)
	}

	return nil
}

func (p *PostgresDB) readTags(userId int) (*sql.Rows, error) {
	query := `SELECT * FROM tags WHERE author=$1`
	rows, err := p.conn.Query(query, userId)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return rows, nil
}

func (p *PostgresDB) PostTag(userId int, tag *models.Tag) (int, error) {
	row := p.postTag(userId, tag)

	var tagId int
	if err := row.Scan(&tagId); err != nil {
		return -1, errors.Wrap(err, "Error occurred when querying the database")
	}

	return tagId, nil
}

func (p *PostgresDB) postTag(userId int, tag *models.Tag) *sql.Row {
	query := `INSERT INTO tags (author, name, profile_id, note_id) VALUES ($1, $2, $3, $4) RETURNING id`
	return p.conn.QueryRow(query, userId, tag.Name, tag.ProfileId, tag.NoteId)
}

func (p *PostgresDB) DeleteTag(userId int, tagId int) error {
	res, err := p.deleteTag(userId, tagId)
	if err != nil {
		return err
	}

	if count, err := res.RowsAffected(); count != 1 || err != nil {
		return errors.Wrap(err, "Database query did not impact a single row")
	}
	return nil
}

func (p *PostgresDB) deleteTag(userId int, tagId int) (sql.Result, error) {
	query := `DELETE FROM tags WHERE id=$1 AND author_id=$2`
	res, err := p.conn.Exec(query, tagId, userId)

	if err != nil {
		return nil, errors.Wrap(err, "Error occurred when querying the database")
	}
	return res, nil
}
