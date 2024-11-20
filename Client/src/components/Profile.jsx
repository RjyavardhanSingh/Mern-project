import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState("stories");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/profiles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.user?.name || "");
          setEmail(data.user?.email || "");
          setBio(data.user?.bio || "");
          setStories(data.stories || []);
        } else {
          const data = await response.json();
          setError(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to update your profile.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, bio }),
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.user?.name || "");
        setEmail(data.user?.email || "");
        setBio(data.user?.bio || "");
        setShowUpdateForm(false);
        setError("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setError("An error occurred while updating. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#ffffff]">Profile Settings</h1>
          <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-3xl font-bold text-gray-900">
            {name.charAt(0)}
          </div>
        </header>

        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-sherif text-[#D4AF37] mb-4">{name}</h2>
              <p className="text-gray-400 mb-2">{email}</p>
              <p className="italic text-gray-400 mb-6">
                {bio || "No bio available. Update your profile to add a bio."}
              </p>
              <button
                onClick={() => setShowUpdateForm(!showUpdateForm)}
                className="w-full bg-[#D4AF37] text-gray-900 py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-700 hover:text-[#D4AF37]"
              >
                {showUpdateForm ? "Cancel" : "Update Profile"}
              </button>
            </div>

            {showUpdateForm && (
              <form
                onSubmit={handleProfileUpdate}
                className="mt-6 bg-[#2a2a2a] rounded-lg p-6 shadow-lg"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded text-white focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded text-white focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bio:
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded text-white focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    rows="4"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-gray-900 py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-700 hover:text-[#D4AF37]"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#2a2a2a] rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-700">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`px-6 py-3 font-semibold transition duration-300 ease-in-out ${
                    activeTab === "stories"
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-400 hover:text-[#D4AF37]"
                  }`}
                >
                  Your Stories
                </button>
              </div>

              {activeTab === "stories" && (
                <div className="p-6">
                  {stories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stories.map((story) => (
                        <div
                          key={story._id}
                          className="bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden"
                        >
                          <div className="p-4">
                            <h4 className="font-bold text-xl mb-2 text-[#D4AF37]">
                              {story.title}
                            </h4>
                            <p className="text-sm text-gray-400 mb-3">By {name}</p>
                            <p className="text-sm mb-4 text-gray-300">
                              {story.content.length > 100
                                ? `${story.content.substring(0, 100)}...`
                                : story.content}
                            </p>
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => navigate(`/stories/${story._id}`)}
                                className="text-text-gray-400 hover:text-[#D4AF37] transition duration-300"
                              >
                                Read more
                              </button>
                              <button
                                onClick={() => navigate(`/edit-story/${story._id}`)}
                                className="bg-[#D4AF37] text-gray-900 py-1 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-700 hover:text-[#D4AF37]"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center mt-6">No stories found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;