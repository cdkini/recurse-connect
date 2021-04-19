package handlers_test

import (
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"

	"testing"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/cdkini/recurse-connect/server/handlers"
	"github.com/gorilla/mux"
)

func (m *mockDB) ParseNote(body io.ReadCloser, note *database.Note) error      { return nil }
func (m *mockDB) ReadNotes(userId int, notes []*database.Note) error           { return nil }
func (m *mockDB) PostNote(userId int, note *database.Note) (int, error)        { return -1, nil }
func (m *mockDB) UpdateNote(userId int, noteId int, note *database.Note) error { return nil }
func (m *mockDB) DeleteNote(userId int, noteId int) error                      { return nil }

func TestGetNotes(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/notes",
			vars: map[string]string{"userId": "3721"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/notes",
			vars: nil,
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("GET", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.GetNotes(db, logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			_, err = ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.StatusCode)
			}
		})
	}
}

func TestPostNote(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/notes",
			vars: map[string]string{"userId": "3721"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/notes",
			vars: nil,
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("POST", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.PostNote(db, logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			_, err = ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.StatusCode)
			}
		})
	}
}

func TestPutNote(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/notes/123",
			vars: map[string]string{"userId": "3721", "noteId": "123"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/notes/123",
			vars: map[string]string{"noteId": "123"},
			code: 400,
		},
		{
			name: "Invalid noteId",
			url:  "localhost:5000/api/v1/users/3721/notes/NaN",
			vars: map[string]string{"userId": "3721"},
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("PUT", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.PutNote(db, logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			_, err = ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.StatusCode)
			}
		})
	}
}

func TestDeleteNote(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/notes/123",
			vars: map[string]string{"userId": "3721", "noteId": "123"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/notes/123",
			vars: map[string]string{"noteId": "123"},
			code: 400,
		},
		{
			name: "Invalid noteId",
			url:  "localhost:5000/api/v1/users/3721/notes/NaN",
			vars: map[string]string{"userId": "3721"},
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("DELETE", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.DeleteNote(db, logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			_, err = ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.StatusCode)
			}
		})
	}
}
