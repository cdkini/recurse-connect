package handlers

import (
	"errors"
	"net/url"
	"testing"
	"time"
)

func TestGetDateRange(t *testing.T) {
	loc, err := time.LoadLocation("EST")
	if err != nil {
		t.Fatalf("Could not establish EST timezone: %v", err)
	}
	tt := []struct {
		name   string
		args   url.Values
		getAll bool
		start  time.Time
		end    time.Time
		err    error
	}{
		{
			name:   "Valid dates",
			args:   map[string][]string{"startDate": {"01-01-2020"}, "endDate": {"12-31-2020"}},
			getAll: false,
			start:  time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			end:    time.Date(2020, 12, 31, 0, 0, 0, 0, loc),
			err:    nil,
		},
		{
			name:   "No dates",
			args:   map[string][]string{},
			getAll: true,
			start:  time.Date(2011, time.January, 0, 0, 0, 0, 0, loc),
			end:    time.Now().In(loc),
			err:    nil,
		},
		{
			name:   "Invalid date format",
			args:   map[string][]string{"startDate": {"2020-01-01"}, "endDate": {"2020-12-31"}},
			getAll: false,
			start:  time.Date(2020, 1, 0, 0, 0, 0, 0, loc),
			end:    time.Date(2020, 12, 31, 0, 0, 0, 0, loc),
			err:    errors.New("Invalid date format"),
		},
		{
			name:   "Missing date arg",
			args:   map[string][]string{},
			getAll: false,
			start:  time.Date(2020, 1, 0, 0, 0, 0, 0, loc),
			end:    time.Time{},
			err:    errors.New("Missing date arg"),
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			start, end, err := getDateRange(tc.args, tc.getAll)

            // TODO: This checks for whether or not an error occurred but there has to be a more idiomatic way to compare errors
			if err != nil && tc.err == nil || err == nil && tc.err != nil {
				t.Errorf("Wanted an error of %v, got %v", tc.err, err)
			}

			// If our expected result is an error, ignore the checks for start and end dates since those are garbage values
			if tc.err == nil && !equal(start, tc.start) {
				t.Errorf("Wanted a start date of %v, got %v", tc.start, start)
			}

			if tc.err == nil && !equal(end, tc.end) {
				t.Errorf("Wanted an end date of %v, got %v", tc.end, end)
			}
		})
	}
}

// func TestDetermineOverlap(t *testing.T) {
// 	loc, err := time.LoadLocation("EST")
// 	if err != nil {
// 		t.Fatalf("Could not establish EST timezone: %v", err)
// 	}

// 	tt := []struct {
// 		name   string
// 		startA time.Time
// 		startB time.Time
// 		endA   time.Time
// 		endB   time.Time
// 		want   int
// 	}{
// 		{
// 			name:   "A and B do not overlap",
// 			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
// 			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
// 			startB: time.Date(2020, 5, 1, 0, 0, 0, 0, loc),
// 			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
// 			want:   -15,
// 		},
// 		{
// 			name:   "A envelopes B",
// 			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
// 			endA:   time.Date(2020, 9, 15, 0, 0, 0, 0, loc),
// 			startB: time.Date(2020, 5, 1, 0, 0, 0, 0, loc),
// 			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
// 			want:   138,
// 		},
// 		{
// 			name:   "A intersects with B",
// 			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
// 			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
// 			startB: time.Date(2020, 2, 1, 0, 0, 0, 0, loc),
// 			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
// 			want:   74,
// 		},
// 		{
// 			name:   "A and B are the same ranges",
// 			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
// 			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
// 			startB: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
// 			endB:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
// 			want:   105,
// 		},
// 	}

// 	for _, tc := range tt {
// 		t.Run(tc.name, func(t *testing.T) {

// 			got := determineOverlap(&tc.startA, &tc.endA, &tc.startB, &tc.endB)

// 			if got != tc.want {
// 				t.Errorf("Wanted an overlap of %v, got %v", tc.want, got)
// 			}
// 		})
// 	}
// }

func equal(t1 time.Time, t2 time.Time) bool {
	if t1.Year() != t2.Year() {
		return false
	}
	if t1.Month() != t2.Month() {
		return false
	}
	if t1.Day() != t2.Day() {
		return false
	}
	return true
}
