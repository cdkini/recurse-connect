package middleware

import (
	"net/http"

	"github.com/cdkini/recurse-connect/server/environment"
	"github.com/gorilla/mux"
)

func SetContentType(r *mux.Router, env *environment.Env) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	}
}