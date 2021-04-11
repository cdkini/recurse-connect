package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/cdkini/recurse-connect/server/config"
	"github.com/cdkini/recurse-connect/server/types"
	"github.com/gorilla/mux"
)

// Endpoint: /api/v1/users/:userId/notes
func GetNotes(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			env.Logger.Printf("The userId arg '%v' is invalid: %v", userId, err)
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		query := `SELECT * FROM notes WHERE author=$1`
		rows, err := env.DB.Query(query, userId)
		if err != nil {
			env.Logger.Printf("Unable to execute the query: %v", err)
			http.Error(w, "Could not execute DB query", http.StatusNoContent)
			return
		}
		defer rows.Close()

		var notes types.Notes

		for rows.Next() {
			var note *types.Note

			if err = rows.Scan(&note.Id, &note.Author, &note.Title, &note.Date, &note.Content); err != nil {
				env.Logger.Printf("Unable to scan query row: %v", err)
				http.Error(w, "Could not scan row into struct", http.StatusInternalServerError)
				return
			}

			if err = note.Validate(); err != nil {
				env.Logger.Printf("Validation error; provided fields do not meet specification: %v", err)
				http.Error(w, "Validation error due to improper field data", http.StatusBadRequest)
				return
			}

			notes = append(notes, note)
		}

		notes.ToJSON(w)
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

		var note types.Note
		if err = note.FromJSON(r.Body); err != nil {
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		if err = note.Validate(); err != nil {
			env.Logger.Printf("Validation error; provided fields do not meet specification: %v", err)
			http.Error(w, "Validation error due to improper field data", http.StatusBadRequest)
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

		var note types.Note
		err = note.FromJSON(r.Body)
		if err = note.FromJSON(r.Body); err != nil {
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
