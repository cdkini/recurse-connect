package handlers

import (
	"encoding/json"
	"github.com/cdkini/recurse-connect/server/environment"
	"net/http"
)

// GET /api/v1/health
func Health(env *environment.Env) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"ok": true,
		}

		json.NewEncoder(w).Encode(resp)
		env.Logger.Println("Successfully returned JSON response for /health endpoint")
	})
}
