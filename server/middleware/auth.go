package middleware

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

// AuthCheck verifies that a session and related cookie have been created for a given user, 
// thus signifying that they have gone through the OAuth2 authentication process
func AuthCheck(store *sessions.CookieStore) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, _ := store.Get(r, "session")
			_, ok := session.Values["userId"]
			if !ok {
				http.Redirect(w, r, "/api/v1/login", http.StatusFound)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
