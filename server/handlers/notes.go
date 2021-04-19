package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/gorilla/mux"
)

// GET /api/v1/users/{userId}/notes
func GetNotes(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper userId passed to endpoint", http.StatusBadRequest)
			return
		}

		var notes []*database.Note
		err = db.ReadNotes(userId, notes)
		if err != nil {
			// TODO: Add error messaging
		}

		json.NewEncoder(w).Encode(notes)
		logger.Println("Successfully returned JSON response for GET request to /notes endpoint")
	})
}

// POST /api/v1/users/{userId}/notes
func PostNote(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var note *database.Note
		if err = db.ParseNote(r.Body, note); err != nil {
			logger.Printf("Could not scan row into struct: %v\n", err)
			http.Error(w, "There was an issue deserializing your data", http.StatusUnprocessableEntity)
			return
		}

		noteId, err := db.PostNote(userId, note)
		if err != nil {
			// TODO: Add error messaging
		}

		resp := map[string]interface{}{
			"id":      noteId,
			"message": "Note created successfully",
		}

		json.NewEncoder(w).Encode(resp)
		logger.Println("Successfully returned JSON response for POST request to /notes endpoint")
	})
}

// PUT /api/v1/users/{userId}/notes/{noteId}
func PutNote(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper userId passed to endpoint", http.StatusBadRequest)
			return
		}

		noteId, err := strconv.Atoi(params["noteId"])
		if err != nil {
			logger.Printf("Could not parse noteId: %v\n", err)
			http.Error(w, "Improper noteId passed to endpoint", http.StatusBadRequest)
			return
		}

		var note *database.Note
        if err = db.ParseNote(r.Body, note); err != nil {
			logger.Printf("Could not scan row into struct: %v\n", err)
			http.Error(w, "There was an issue deserializing your data from JSON", http.StatusInternalServerError)
			return
		}

		err = db.UpdateNote(userId, noteId, note)
		if err != nil {
			// TODO: Come back to this to update messages!
			logger.Printf("Issue counting rows affected: %v\n", err)
			http.Error(w, "There was an issue with the database query", http.StatusInternalServerError)
			return
		}

		resp := map[string]interface{}{
			"id":      noteId,
			"message": "Note updated successfully.",
		}

		json.NewEncoder(w).Encode(resp)
		logger.Println("Successfully returned JSON response for PUT request to /notes endpoint")
	})
}

// DELETE /api/v1/users/{userId}/notes/{noteId}
func DeleteNote(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper userId passed to endpoint", http.StatusBadRequest)
			return
		}

		noteId, err := strconv.Atoi(params["noteId"])
		if err != nil {
			logger.Printf("Could not parse noteId: %v\n", err)
			http.Error(w, "Improper noteId passed to endpoint", http.StatusBadRequest)
			return
		}

		err = db.DeleteNote(userId, noteId)
		if err != nil {
			// TODO: Deal with error
		}

		resp := map[string]interface{}{
			"id":      noteId,
			"message": "Note updated successfully.",
		}

		json.NewEncoder(w).Encode(resp)
		logger.Println("Successfully returned JSON response for DELETE request to /notes endpoint")
	})
}
