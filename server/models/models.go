package models

import "time"

// Graph represents all the nodes and edges necessary to create a weighted, directed graph out of Recurser data.
type Graph struct {
	Recursers []RecurserNode `json:"recursers"`
	Batches   []BatchNode    `json:"batches"`
	Edges     []Edge         `json:"edges"`
}

func NewGraph() *Graph {
    return &Graph{make([]RecurserNode, 0), make([]BatchNode, 0), make([]Edge, 0)}
}

// RecurserNode represents an individual Recurser (including their profile data as noted in the RC Directory).
// Individuals are associated with the first batch they've done so returning Recursers will maintain the same BatchName attribute.
// The date range is determined by the earliest batch start date and the latest batch end date.
type RecurserNode struct {
	Id             int        `json:"id"`
	Name           *string    `json:"name"`
	ProfilePath    *string    `json:"profilePath"`
	ImagePath      *string    `json:"imagePath"`
	Location       *string    `json:"location"`
	Company        *string    `json:"company"`
	Bio            *string    `json:"bio"`
	Interests      *string    `json:"interests"`
	BeforeRc       *string    `json:"beforeRc"`
	DuringRc       *string    `json:"duringRc"`
	Email          *string    `json:"email"`
	GitHub         *string    `json:"github"`
	Twitter        *string    `json:"twitter"`
	BatchName      *string    `json:"batchName"`
	BatchShortName *string    `json:"batchShortName"`
	StartDate      *time.Time `json:"startDate"`
	EndDate        *time.Time `json:"endDate"`
}

// BatchNode represents a given batch in RC's history.
// The date range is determined by the earliest participant start date and the latest participant end date in that batch.
type BatchNode struct {
	Id        int        `json:"id"`
	Name      string     `json:"name"`
	StartDate *time.Time `json:"startDate"`
	EndDate   *time.Time `json:"endDate"`
}

// Edge represents weighted, directed connections between nodes (RecurserNodes and/or BatchNodes).
type Edge struct {
	To     int `json:"to"`
	From   int `json:"from"`
	Weight int `json:"weight"`
}

// Note represents an entry by a participant regarding their interactions with other participants.
type Note struct {
	Id       int    `json:"id"`
	AuthorId int    `json:"authorId"`
	Title    string `json:"title"`
	Date     string `json:"date"`
	Content  string `json:"content"`
}

// Tag represents a keyword association with a given Recurser.
// Tags may or may not be associated with a note depending on usage.
type Tag struct {
	Id        int    `json:"id"`
	AuthorId  int    `json:"authorId"`
	Name      string `json:"name"`
	ProfileId int    `json:"profileId"`
	NoteId    int    `json:"noteId"`
}
