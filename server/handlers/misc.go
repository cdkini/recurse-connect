package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
)

// GET /api/v1/health
func Health(logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		resp := map[string]interface{}{
			"ok": true,
		}

		json.NewEncoder(w).Encode(resp)
		logger.Println("Successfully returned JSON response for /health endpoint")
	})
}

// // GET api/v1/whoami
func Whoami(logger *log.Logger, store *sessions.CookieStore) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := store.Get(r, "session")
		userId, ok := session.Values["userId"]
		name, ok := session.Values["name"]

		if !ok {
			logger.Println("Could not find user session")
			http.Error(w, "User not authenticated", http.StatusForbidden)
			return
		}

		logger.Printf("Identified user %v\n", userId)

		resp := map[string]interface{}{
			"id":   userId,
			"name": name,
		}

		json.NewEncoder(w).Encode(resp)
	})
}
