package handlers

import (
	"encoding/json"
	"net/http"
)

// Endpoint: /api/v1/health
func Health() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		resp := map[string]interface{}{
			"ok": true,
		}

		json.NewEncoder(w).Encode(resp)
	})
}
