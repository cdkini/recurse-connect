package middleware

import (
	"net/http"

	"github.com/cdkini/recurse-connect/server/config"
	"github.com/gorilla/mux"
)

func AuthCheck(r *mux.Router, env *config.Env) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, _ := env.Store.Get(r, "session")
			_, ok := session.Values["userId"]
			if !ok {
				http.Redirect(w, r, "//api/v1/login", http.StatusFound)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
