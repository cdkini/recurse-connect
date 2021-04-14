package types

import (
	"encoding/json"
	"io"
)

type Note struct {
	Id      int     `json:"id"`
	Author  *string `json:"author"`
	Title   *string `json:"title"`
	Date    *string `json:"date"`
	Content *string `json:"content"`
}

type Notes []*Note

func (n *Note) FromJSON(r io.Reader) error {
	return json.NewDecoder(r).Decode(n)
}

func (n *Note) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(n)
}

func (n *Notes) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(n)
}

// FIXME: Could not get validators pkg working for datetime and json; open to come back with updates
// func (n *Note) Validate() error {
// 	validate := validator.New()
// 	return validate.Struct(n)
// }
