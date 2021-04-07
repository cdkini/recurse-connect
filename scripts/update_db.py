#!/usr/bin/python

import requests
import os
import time

from datetime import datetime

import dotenv 
import psycopg2

connections = 0


def connect_to_db(db_name, user, host, password):
    """Establishes a connection with the Postgres database. 
    The resulting connection and cursor need to be manually closed after usage.

    Args:
        db_name   str): Name of the Postgres database
        user     (str): Name of the Postgres user
        host     (str): The host the database is using
        password (str): Credentials necessary to read/write

    Returns:
        psycopg2.cursor:     Object used to make queries from connection
        psycopg2.connection: Connection to the Postgres database
    """
    connect_str = f"dbname={db_name} user={user} host={host} password={password}"

    # Use our connection values to establish a connection
    psql_connection = psycopg2.connect(connect_str)

    # Create a psycopg2 cursor that can execute queries
    psql_cursor = psql_connection.cursor()

    return psql_cursor, psql_connection

def get_profiles(access_token):
    """Accesses the Recurse API to obtain and aggregate information about individual participants.
    These details are written to a list for subsequent usage.
    See https://github.com/recursecenter/wiki/wiki/Recurse-Center-API for more details.

    Args:
        access_token (str): User specific authentication provided by Recurse API

    Returns:
        list[str]: JSON-formatted strings representing individual user profiles

    Raises:
        HTTPError: Raised if GET request fails for any reason
    """
    offset = 0
    profiles = []

    while True:
        r = requests.get(
            f"https://www.recurse.com/api/v1/profiles/?limit=50&offset={offset}&access_token={access_token}"
        )
        r.raise_for_status()

        response = r.json()
        if len(response) == 0:
            break

        for profile in response:
            profiles.append(profile)

        offset += len(response)  # API maxes out at 50 profiles per GET

    print(f"Successfully requested {offset:,} profiles from API")

    return profiles


def update_db(profiles, psql_cursor, psq_connection):
    """Updates all database tables with profile details obtained from API.

    Each table update invokes a private helper method. These tables include:
      - Profile:     Individual participant and their details. Primary table for information
      - Location:    Current city/state/country participant is located in
      - Batch:       Which Recurse-defined period the participant has attended (Winter 1, Winter 2, etc)
      - Stint:       The specific days in which the participant has attended a given batch
      - Company:     Where the participant currently works

    Args:
        profiles (list[str]):                  JSON data about participants as gathered from API
        psql_cursor (psycopg2.cursor):         Database cursor used to insert/update the relevant tables
        psql_connection (psycopg2.connection): Database connection used to commit cursor changes

    Returns:
        None
    """
    for profile in profiles:
        _update_location_table(profile, psql_cursor, psql_connection)
        _update_company_table(profile, psql_cursor, psql_connection)
        _update_profile_table(profile, psql_cursor, psql_connection)
        _update_batch_and_stint_tables(profile, psql_cursor, psql_connection)

    print(f"Successfully updated database entries")


def _update_profile_table(profile, psql_cursor, psql_connection):
    profile_id = profile.get("id")
    name = profile.get("name")
    profile_path = f"www.recurse.com/directory/{profile.get('slug')}"
    image_path = profile.get("image_path")

    bio = profile.get("bio_hl")
    interests = profile.get("interests_hl")
    before_rc = profile.get("before_rc_hl")
    during_rc = profile.get("during_rc_hl")

    email = profile.get("email_hl")
    github = profile.get("github")
    if github:
        github = f"github.com/{github}"
    twitter = profile.get("twitter")
    if twitter:
        twitter = f"twitter.com/{twitter}"

    location = profile.get("current_location")
    location_id = None if not location else location.get("id")

    company = profile.get("company")
    company_id = None if not company else company.get("id")

    query = """ 
    INSERT INTO profile (id, name, profile_path, image_path, interests, location_id, company_id, before_rc, bio, during_rc, email, github, twitter) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO UPDATE 
    SET (image_path, interests, location_id, company_id, before_rc, bio, during_rc, email, github, twitter) = 
    (EXCLUDED.image_path, EXCLUDED.interests, EXCLUDED.location_id, EXCLUDED.company_id, EXCLUDED.before_rc, EXCLUDED.bio, EXCLUDED.during_rc, EXCLUDED.email, EXCLUDED.github, EXCLUDED.twitter);
    """
    vals = (
        profile_id, name, profile_path, 
        image_path, interests, location_id, 
        company_id, before_rc, bio, during_rc, 
        email, github, twitter
    )

    psql_cursor.execute(query, vals)
    psql_connection.commit()


def _update_location_table(profile, psql_cursor, psql_connection):
    location = profile.get("current_location")
    if not location:
        return

    loc_id = location.get("id")
    name = location.get("name")

    query = """ 
    INSERT INTO location (id, name) 
    VALUES (%s, %s)
    ON CONFLICT (id) DO NOTHING;
    """
    vals = (loc_id, name)

    psql_cursor.execute(query, vals)
    psql_connection.commit()


def _update_batch_and_stint_tables(profile, psql_cursor, psql_connection):
    profile_id = profile.get("id")

    stints = profile.get("stints")
    for stint in stints:
        batch = stint.get("batch")
        if not batch:
            continue  # Excludes facilitators and test users

        # Update 'Batch' db table
        batch_id = batch.get("id")
        name = batch.get("name")
        short_name = batch.get("short_name")

        query = """ 
        INSERT INTO batch (id, name, short_name) 
        VALUES (%s, %s, %s)
        ON CONFLICT (id) DO NOTHING;
        """
        vals = (batch_id, name, short_name)

        psql_cursor.execute(query, vals)
        psql_connection.commit()

        # Update 'Stint' db table
        stint_id = stint.get("id")
        start_date = datetime.strptime(stint.get("start_date"), "%Y-%m-%d")
        end_date = datetime.strptime(stint.get("end_date"), "%Y-%m-%d")

        query = """ 
        INSERT INTO stint (id, start_date, end_date, batch_id, profile_id) 
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING;
        """
        vals = (stint_id, start_date, end_date, batch_id, profile_id)

        psql_cursor.execute(query, vals)
        psql_connection.commit()


def _update_company_table(profile, psql_cursor, psql_connection):
    company = profile.get("company")
    if not company:
        return

    company_id = company.get("id")
    name = company.get("name")

    query = """ 
    INSERT INTO company (id, name) 
    VALUES (%s, %s)
    ON CONFLICT (id) DO NOTHING;
    """
    vals = (company_id, name)

    psql_cursor.execute(query, vals)
    psql_connection.commit()


if __name__ == "__main__":
    try:
        start = time.time()

        dotenv.load_dotenv()
        DB_NAME = os.getenv('APP_DB_NAME')
        USER = os.getenv('APP_DB_USERNAME')
        HOST = os.getenv('APP_DB_HOST')
        PASSWORD = os.getenv('APP_DB_PASSWORD')
        API_TOKEN = os.getenv("API_TOKEN")

        psql_cursor, psql_connection = connect_to_db(DB_NAME, USER, HOST, PASSWORD)
        profiles = get_profiles(API_TOKEN)
        update_db(profiles, psql_cursor, psql_connection)

        end = time.time()
        print(f"Total script time: {end - start:.2f} seconds")

    except (Exception, psycopg2.Error) as error:
        print("Error connecting to Postgres", error)
        psql_cursor = None

    finally:
        if psql_cursor:
            psql_cursor.close()
            psql_connection.close()
            print("Postgres connection is now closed")

