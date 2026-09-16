import { useEffect, useState } from "react";

import {
  Heart,
  Search,
  Plus,
  RefreshCw,
  X,
  Save,
  ExternalLink
} from "lucide-react";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";


function AdminCharities() {

  const [charities, setCharities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  const [form, setForm] =
    useState({
      name: "",
      description: "",
      category: "",
      image_url: "",
      website_url: "",
      is_active: true
    });


  // ==========================================
  // TOKEN
  // ==========================================

  function getToken() {
    return localStorage.getItem(
      "digitalHeroesToken"
    );
  }


  // ==========================================
  // LOAD CHARITIES
  // ==========================================

  async function loadCharities() {

    setLoading(true);
    setError("");

    try {

      const token =
        getToken();


      const response =
        await fetch(
          `${API_URL}/admin/charities`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load charities"
        );
      }


      setCharities(
        data.charities || []
      );

    } catch (error) {

      console.error(
        "Admin charities error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadCharities();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCharities =
    charities.filter(
      (charity) => {

        const text =
          search
            .toLowerCase()
            .trim();


        if (!text) {
          return true;
        }


        return (

          charity.name
            ?.toLowerCase()
            .includes(text) ||

          charity.category
            ?.toLowerCase()
            .includes(text) ||

          charity.description
            ?.toLowerCase()
            .includes(text)

        );

      }
    );


  // ==========================================
  // FORM CHANGE
  // ==========================================

  function handleChange(event) {

    const {
      name,
      value,
      type,
      checked
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value
      })
    );

  }


  // ==========================================
  // RESET FORM
  // ==========================================

  function resetForm() {

    setForm({
      name: "",
      description: "",
      category: "",
      image_url: "",
      website_url: "",
      is_active: true
    });

    setShowForm(false);

  }


  // ==========================================
  // CREATE CHARITY
  // ==========================================

  async function createCharity(event) {

    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");


    try {

      const token =
        getToken();


      /*
        IMPORTANT:

        The current backend does not yet
        contain an admin POST /charities
        endpoint.

        Therefore this will be connected
        after we add the backend CRUD
        endpoint.
      */


      throw new Error(
        "Charity creation API is not connected yet. Existing charity listing is working."
      );


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSaving(false);

    }

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="admin-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>


          <h1>
            Charities
          </h1>


          <p>
            Manage the organisations
            supported by Digital Heroes.
          </p>

        </div>


        <div className="admin-header-actions">

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadCharities
            }
            disabled={loading}
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "admin-spin"
                  : ""
              }
            />

            Refresh

          </button>


          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              setError("");
              setMessage("");
              setShowForm(true);
            }}
          >

            <Plus size={17} />

            Add charity

          </button>

        </div>

      </div>


      {/* ================================= */}
      {/* MESSAGES */}
      {/* ================================= */}

      {error && (

        <div className="admin-error">

          {error}

        </div>

      )}


      {message && (

        <div className="admin-success">

          {message}

        </div>

      )}


      {/* ================================= */}
      {/* CREATE FORM */}
      {/* ================================= */}

      {showForm && (

        <div className="admin-form-card">

          <div className="admin-form-header">

            <div>

              <h2>
                Add charity
              </h2>

              <p>
                Create a new charity
                organisation.
              </p>

            </div>


            <button
              type="button"
              className="admin-close-button"
              onClick={resetForm}
            >
              <X size={18} />
            </button>

          </div>


          <form
            className="admin-form"
            onSubmit={createCharity}
          >

            <div className="admin-form-grid">

              <div className="admin-form-group">

                <label>
                  Charity name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Charity name"
                  required
                />

              </div>


              <div className="admin-form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={
                    handleChange
                  }
                  placeholder="Education, Health, Environment..."
                />

              </div>


              <div className="admin-form-group full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the charity..."
                  rows="4"
                />

              </div>


              <div className="admin-form-group">

                <label>
                  Image URL
                </label>

                <input
                  type="url"
                  name="image_url"
                  value={
                    form.image_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />

              </div>


              <div className="admin-form-group">

                <label>
                  Website URL
                </label>

                <input
                  type="url"
                  name="website_url"
                  value={
                    form.website_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />

              </div>

            </div>


            <div className="admin-form-footer">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >

                <Save size={16} />

                {saving
                  ? "Saving..."
                  : "Create charity"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-result-count">

          <Heart size={16} />

          {filteredCharities.length}
          {" "}
          charities

        </div>

      </div>


      {/* ================================= */}
      {/* CHARITY LIST */}
      {/* ================================= */}

      <div className="admin-charity-grid">

        {loading ? (

          <div className="admin-table-card">

            <div className="admin-table-loading">

              Loading charities...

            </div>

          </div>

        ) : filteredCharities.length === 0 ? (

          <div className="admin-table-card">

            <div className="admin-empty">

              <Heart size={35} />

              <h3>
                No charities found
              </h3>

              <p>
                Try a different search.
              </p>

            </div>

          </div>

        ) : (

          filteredCharities.map(
            (charity) => (

              <div
                className="admin-charity-card"
                key={charity.id}
              >

                <div className="admin-charity-image">

                  {charity.image_url ? (

                    <img
                      src={
                        charity.image_url
                      }
                      alt={
                        charity.name
                      }
                    />

                  ) : (

                    <Heart size={32} />

                  )}

                </div>


                <div className="admin-charity-body">

                  <div className="admin-charity-top">

                    <span className="admin-charity-category">

                      {charity.category ||
                        "Community"}

                    </span>


                    <span
                      className={
                        charity.is_active
                          ? "admin-active-badge"
                          : "admin-inactive-badge"
                      }
                    >

                      {charity.is_active
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>


                  <h3>
                    {charity.name}
                  </h3>


                  <p>
                    {charity.description ||
                      "No description available."}
                  </p>


                  {charity.website_url && (

                    <a
                      href={
                        charity.website_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="admin-charity-link"
                    >

                      Visit website

                      <ExternalLink
                        size={14}
                      />

                    </a>

                  )}

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>

  );
}


export default AdminCharities;