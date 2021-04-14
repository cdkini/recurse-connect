package middleware

import (
	"net/http"

	"github.com/cdkini/recurse-connect/server/environment"
	"github.com/gorilla/mux"
)

func ConfigureCORS(r *mux.Router, env *environment.Env) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "127.0.0.1:3000")
			next.ServeHTTP(w, r)
		})
	}
}
