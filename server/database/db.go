package database

import (
	"io"
	"time"

    "github.com/cdkini/recurse-connect/server/models"
)

// DB is responsible for all database interaction in the application.
// It is defined by its behavior rather than its implementation to facilitate mocking.
type DB interface {
	Profiles
	Notes
	Tags
}

type Profiles interface {
	ReadGraph(start time.Time, end time.Time, graph *models.Graph) error
}

type Notes interface {
    ParseNote(body io.Reader, note *models.Note) error
	ReadNotes(userId int, notes []*models.Note) error
	PostNote(userId int, note *models.Note) (int, error)
	UpdateNote(userId int, noteId int, note *models.Note) error
	DeleteNote(userId int, noteId int) error
}

type Tags interface {
    ParseTag(body io.Reader, tag *models.Tag) error
	ReadTags(userId int, tags []*models.Tag) error
	PostTag(userId int, tag *models.Tag) (int, error)
	DeleteTag(userId int, tagId int) error
}
