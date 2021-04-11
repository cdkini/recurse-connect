package types

import (
	"encoding/json"
	"io"

	"github.com/go-playground/validator"
)

type Tag struct {
	Id        int    `json:"id" validate:"numeric"`
	Author    string `json:"author" validate:"required,alpha"`
	Name      string `json:"name" validate:"required,alpha"`
	ProfileId int    `json:"profileId" validate:"required,numeric"`
	NoteId    int    `json:"noteId" validate:"required,numeric"`
}

type Tags []*Tag

func (t *Tag) FromJSON(r io.Reader) error {
	return json.NewDecoder(r).Decode(t)
}

func (t *Tag) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(t)
}

func (t *Tags) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(t)
}

func (t *Tag) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}
