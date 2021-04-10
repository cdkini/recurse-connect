package server

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gorilla/mux"
)

// expectedResponse has just the attributes of an http.Response that are important for testing
type expectedResponse struct {
	statusCode int
	headers    map[string]string
	body       map[string]interface{}
}

func newMockApp() (*App, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	app := &App{mux.NewRouter(), db}
	app.initializeRoutes()
	if err != nil {
		log.Fatalf("An error '%s' was not expected when opening a stub database connection", err)
	}

	return app, mock
}

func TestHealth(t *testing.T) {
	app, _ := newMockApp()
	req, err := http.NewRequest("GET", "/api/v1/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.health)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if status code, headers, and body match expected
	expected := expectedResponse{
		statusCode: 200,
		headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
			"Content-Type":                "text/plain; charset=utf-8",
			"Context-Type":                "application/x-www-form-urlencoded",
		},
		body: map[string]interface{}{
			"ok": true,
		},
	}

	resp := rr.Result()

	if resp.StatusCode != expected.statusCode {
		t.Errorf("Handler returned unexpected status code: got %v want %v",
			resp.StatusCode, expected.statusCode)
	}

	for key := range resp.Header {
		if resp.Header.Get(key) != expected.headers[key] {
			t.Errorf("Handler returned unexpected header: got %v want %v", resp.Header.Get(key), expected.headers[key])
		}
	}

	var body map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&body)
	if err != nil {
		t.Errorf("Response body not JSON serializable; something went wrong: %v", err)
	}

	for key := range body {
		if _, ok := expected.body[key]; !ok || body[key] != expected.body[key] {
			t.Errorf("Handler returned unexpected body: got %v want %v", body[key], expected.body[key])
		}
	}
}

func TestGetMultipleProfiles(t *testing.T) {
	t.SkipNow()
}

func TestGetProfile(t *testing.T) {
	t.SkipNow()
}

func TestGetNotes(t *testing.T) {
	t.SkipNow()
}

func TestPostNote(t *testing.T) {
	t.SkipNow()
}

func TestPutNote(t *testing.T) {
	t.SkipNow()
}

func TestDeleteNote(t *testing.T) {
	t.SkipNow()
}

func TestGetTags(t *testing.T) {
	t.SkipNow()
}

func TestPostTag(t *testing.T) {
	t.SkipNow()
}

func TestDeleteTag(t *testing.T) {
	t.SkipNow()
}
