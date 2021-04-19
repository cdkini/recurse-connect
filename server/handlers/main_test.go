package handlers_test

import (
	"io/ioutil"
	"log"
	"testing"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/gorilla/sessions"
)

// Fulfills the database.DB interface
// Methods are defined in respective handler test files
type mockDB struct{}

func setup(t *testing.T) (database.DB, *log.Logger, *sessions.CookieStore) {
	logger := log.New(ioutil.Discard, "Test: ", log.LstdFlags)
	return &mockDB{}, logger, sessions.NewCookieStore([]byte("test-store"))
}
