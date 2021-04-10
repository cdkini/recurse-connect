package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/cdkini/recurse-connect/server/config"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

type Note struct {
	Id      int    `json:"id"`
	Author  string `json:"author"`
	Title   string `json:"title"`
	Date    string `json:"date"`
	Content string `json:"content"`
}

type Notes []*Note

// Endpoint: /api/v1/users/:userId/notes
func GetNotes(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		query := `SELECT * FROM notes WHERE author=$1`
		rows, err := env.DB.Query(query, userId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}
		defer rows.Close()

		var notes Notes

		for rows.Next() {
			var note *Note

			err = rows.Scan(&note.Id, &note.Author, &note.Title, &note.Date, &note.Content)
			if err != nil {
				log.Fatalf("Unable to scan the row. %v", err)
			}

			notes = append(notes, note)
		}

		json.NewEncoder(w).Encode(notes)

	})
}

// Endpoint: /api/v1/users/:userId/notes
func PostNote(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var note Note
		err = json.NewDecoder(r.Body).Decode(&note)
		if err != nil {
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		var noteId int
		query := `INSERT INTO notes (author, title, date, content) VALUES ($1, $2, $3, $4) RETURNING id`
		err = env.DB.QueryRow(query, userId, note.Title, note.Date, note.Content).Scan(&noteId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}

		fmt.Printf("Inserted a single record %v", noteId)

		resp := map[string]interface{}{
			"id":      noteId,
			"message": "Note created successfully",
		}

		json.NewEncoder(w).Encode(resp)
	})
}

// Endpoint: /api/v1/users/:userId/notes/:noteId
func PutNote(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}
		noteId, err := strconv.Atoi(params["noteId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var note Note
		err = json.NewDecoder(r.Body).Decode(&note)
		if err != nil {
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		query := `UPDATE notes SET title=$2, date=$3, content=$4 WHERE id=$1 AND author=$2`
		res, err := env.DB.Exec(query, noteId, userId, note.Title, note.Date, note.Content)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			log.Fatalf("Error while checking the affected rows: %v", err)
		}

		fmt.Printf("Total rows/record affected %v", rowsAffected)

		resp := map[string]interface{}{
			"id":      noteId,
			"message": fmt.Sprintf("User updated successfully. Total rows/record affected %v", rowsAffected),
		}

		json.NewEncoder(w).Encode(resp)
	})
}

// Endpoint: /api/v1/users/:userId/notes/:noteId
func DeleteNote(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}
		noteId, err := strconv.Atoi(params["noteId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		query := `DELETE FROM notes WHERE id=$1 AND author=$2`
		res, err := env.DB.Exec(query, noteId, userId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			log.Fatalf("Error while checking the affected rows. %v", err)
		}

		fmt.Printf("Total rows/record affected %v", rowsAffected)

		resp := map[string]interface{}{
			"id":      noteId,
			"message": fmt.Sprintf("Note updated successfully. Total rows/record affected %v", rowsAffected),
		}

		json.NewEncoder(w).Encode(resp)
	})
}
