package types

import (
	"encoding/json"
	"io"
)

type Tag struct {
	Id        int    `json:"id"`
	Author    string `json:"author"`
	Name      string `json:"name"`
	ProfileId int    `json:"profileId"`
	NoteId    int    `json:"noteId"`
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

// FIXME: Could not get validators pkg working for datetime and json; open to come back with updates
// func (t *Tag) Validate() error {
// 	validate := validator.New()
// 	return validate.Struct(t)
// }
