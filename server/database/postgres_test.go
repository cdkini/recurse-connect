package database_test

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cdkini/recurse-connect/server/database"
	"github.com/cdkini/recurse-connect/server/models"
)

// TODO: Database tests need some work!

func setup(t *testing.T) (*database.PostgresDB, sqlmock.Sqlmock, func()) {
	conn, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("An error '%s' was not expected when opening a stub database connection", err)
	}

	pg := database.NewPostgresDB(conn)
	teardown := func() {
		conn.Close()
	}

	return pg, mock, teardown
}

// Graph methods ========================================================================================================

func TestReadGraph(t *testing.T) {}

func TestGetRecurserNodes(t *testing.T)        {
	tt := []struct {
		name   string
		userId int
        start time.Time
        end time.Time
	}{
		{
			name:   "Successfully query database",
			userId: 123,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectQuery("SELECT (.+) FROM profiles").
				WithArgs(tc.start, tc.end)

			pg.GetRecurserNodes(tc.start, tc.end)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

// Note methods ========================================================================================================

func TestParseNote(t *testing.T) {} // TODO: Implement!

func TestReadNotes(t *testing.T) {
	tt := []struct {
		name   string
		userId int
	}{
		{
			name:   "Successfully query database",
			userId: 123,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectQuery("SELECT (.+) FROM notes").
				WithArgs(tc.userId)

            var notes []*models.Note
			pg.ReadNotes(tc.userId, notes)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestPostNote(t *testing.T) {
	tt := []struct {
		name   string
		userId int
		note   *models.Note
	}{
		{
			name:   "Successfully query database",
			userId: 123,
			note: &models.Note{
				Id:       711,
				AuthorId: 123,
				Title:    "React Workshop",
				Date:     "05-01-1996",
				Content:  "React didn't even exist!",
			},
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectQuery("INSERT INTO notes (.+)").
				WithArgs(tc.userId, tc.note.Title, tc.note.Date, tc.note.Content)

			pg.PostNote(tc.userId, tc.note)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestUpdateNote(t *testing.T) {
	tt := []struct {
		name   string
		userId int
		noteId  int
        note *models.Note
	}{
		{
			name: "Successfully query database",
			userId: 123,
			noteId: 456,
			note:   &models.Note{
				Id:       4,
				AuthorId: 123,
				Title:    "Code Review",
				Date:     "03-01/2020",
				Content:  "An event happened!",
			},
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectExec("UPDATE notes").
                WithArgs(tc.noteId, tc.userId, tc.note.Title, tc.note.Date, tc.note.Content)

            pg.UpdateNote(tc.noteId, tc.userId, tc.note)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}

}

func TestDeleteNote(t *testing.T) {
	tt := []struct {
		name   string
		userId int
		tagId  int
	}{
		{
			name:   "Successfully query database",
			userId: 123,
			tagId:  456,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectExec("DELETE FROM tags")

			pg.DeleteTag(tc.tagId, tc.userId)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

// Tag methods =========================================================================================================

func TestReadTags(t *testing.T) {
	tt := []struct {
		name   string
		userId int
	}{
		{
			name:   "Successfully query database",
			userId: 123,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectQuery("SELECT (.+) FROM tags").
				WithArgs(tc.userId)

            var tags []*models.Tag
			pg.ReadTags(tc.userId, tags)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestPostTag(t *testing.T) {
	tt := []struct {
		name   string
		userId int
		tag    *models.Tag
	}{
		{
			name:   "Successfully query database",
			userId: 123,
			tag: &models.Tag{
				Id:        777,
				AuthorId:  123,
				Name:      "Bananas",
				ProfileId: 768,
				NoteId:    456,
			},
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectQuery("INSERT INTO tags (.+)").
				WithArgs(tc.tag.AuthorId, tc.tag.Name, tc.tag.ProfileId, tc.tag.NoteId)

			pg.PostTag(tc.userId, tc.tag)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestDeleteTag(t *testing.T) {
	tt := []struct {
		name   string
		userId int
		tagId  int
	}{
		{
			name:   "Successfully query database",
			userId: 123,
			tagId:  456,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			pg, mock, teardown := setup(t)
			defer teardown()

			mock.ExpectExec("DELETE FROM tags")

			pg.DeleteTag(tc.tagId, tc.userId)

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("There were unfulfilled expectations: %s", err)
			}
		})
	}
}
