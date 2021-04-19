package handlers_test

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cdkini/recurse-connect/server/handlers"
)

func TestHealth(t *testing.T) {
	tt := []struct {
		name string
		body string
		code int
	}{
		{name: "Valid request", body: "{\"ok\":true}", code: 200},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("GET", "localhost:5000/health", nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			_, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.Health(logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			body, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			str := string(bytes.TrimSpace(body))
			if str != tc.body {
				t.Errorf("Expected body %v; got %v", tc.body, str)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.Status)
			}
		})
	}
}
