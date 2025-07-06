"use client";

import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "MajstorL/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountDetailsPage() {
    // Dummy initial data (replace with real user data)
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [ogname, setOgName] = useState("");
    const [ogusername, setOgUsername] = useState("");
    const [email, setEmail] = useState<string | null>(null)
    const [oldpassword, setoldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [autoSendEnabled, setAutoSendEnabled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const [nameMessage, setNameMessage] = useState("");
    const [nameMessageType, setNameMessageType] = useState<"success" | "error" | "">("");

    const [usernameMessage, setUsernameMessage] = useState("");
    const [usernameMessageType, setUsernameMessageType] = useState<"success" | "error" | "">("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordMessageType, setPasswordMessageType] = useState<"success" | "error" | "">("");



    useEffect(() => {
    const localToken = localStorage.getItem("tracebit_token");
    if (!localToken) {
        setEmail(null);
        return;
    }
    try {
        const decoded: { email?: string } = jwtDecode(localToken);
        setEmail(decoded.email ?? null);
    } catch {
        setEmail(null);
    }

    async function getUser() {
        try {
        const response = await fetch(`${BACKEND_URL}/api/getuser`, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${localToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setFullName(data.full_name);
            setUsername(data.username);
            setOgName(data.full_name);
            setOgUsername(data.username);
            setAutoSendEnabled(data.autosend || false); // Assuming the backend returns this field
        } else {
            setUsername("");
        }
        } catch {
        setUsername("");
        }
    }

    getUser();
    }, []);

    


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Clear previous messages at the start
        setNameMessage("");
        setNameMessageType("");
        setUsernameMessage("");
        setUsernameMessageType("");
        setPasswordMessage("");
        setPasswordMessageType("");
        setMessage("");
        setMessageType("");

        if(fullName !== ogname) {
            if(fullName === "") {
            setNameMessage("Name cannot be empty.");
            setNameMessageType("error");
            return;
            }
            if(fullName.length < 3) {
            setNameMessage("Name must be at least 3 characters long.");
            setNameMessageType("error");
            return;
            }
            if(fullName.length > 50) {
            setNameMessage("Name must be less than 50 characters long.");
            setNameMessageType("error");
            return;
            }
            try {
            const localToken = localStorage.getItem("tracebit_token");
            const response = await fetch(`${BACKEND_URL}/api/update-name`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localToken}`,
                },
                body: JSON.stringify({ full_name: fullName }),
            });

            if (response.ok) {
                setNameMessage("Name updated successfully!");
                setNameMessageType("success");
            } else {
                const errorData = await response.json();
                setNameMessage(`Error: ${errorData.detail || "Failed to update name."}`);
                setNameMessageType("error");
            }
            } catch{
            setNameMessage("Network error: Could not update name.");
            setNameMessageType("error");
            }
        }

        if(username !== ogusername) {
            if(username === "") {
            setUsernameMessage("Username cannot be empty.");
            setUsernameMessageType("error");
            return;
            }
            if(username.length < 3) {
            setUsernameMessage("Username must be at least 3 characters long.");
            setUsernameMessageType("error");
            return;
            }
            if(username.length > 50) {
            setUsernameMessage("Username must be less than 50 characters long.");
            setUsernameMessageType("error");
            return;
            }
            try {
            const localToken = localStorage.getItem("tracebit_token");
            const response = await fetch(`${BACKEND_URL}/api/update-username`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localToken}`,
                },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                setUsernameMessage("Username updated successfully!");
                setUsernameMessageType("success");
            } else {
                const errorData = await response.json();
                setUsernameMessage(`Error: ${errorData.detail || "Failed to update username."}`);
                setUsernameMessageType("error");
            }
            } catch {
            setUsernameMessage("Network error: Could not update username.");
            setUsernameMessageType("error");
            }
        }

        if(oldpassword === "" && (password !== "" || confirmPassword !== "")) {   
            setPasswordMessage("Old password cannot be empty.");
            setPasswordMessageType("error");
            return;
        }

        if(password === "" && confirmPassword === "") {
            return;
        }

        if(password !== confirmPassword) {
            setPasswordMessage("Passwords do not match.");
            setPasswordMessageType("error");
            return;
        }

        if(password.length < 8) {
            setPasswordMessage("Password must be at least 8 characters long.");
            setPasswordMessageType("error");
            return; 
        }

        if(password === confirmPassword) {
            try {
            const localToken = localStorage.getItem("tracebit_token");
            const response = await fetch(`${BACKEND_URL}/api/update-password`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localToken}`,
                },
                body: JSON.stringify({ password, old_password: oldpassword }),
            });

            if (response.ok) {
                setPasswordMessage("Password updated successfully!");
                setPasswordMessageType("success");
            } else {
                const errorData = await response.json();
                setPasswordMessage(`Error: ${errorData.detail || "Failed to update password."}`);
                setPasswordMessageType("error");
                return;
            }
            } catch {
            setPasswordMessage("Network error: Could not update password.");
            setPasswordMessageType("error");
            }
        }

        // Overall success message (only if no individual errors returned early)
        setMessage("Account details updated successfully!");
        setMessageType("success");

        // Clear passwords after update
        setPassword("");
        setConfirmPassword("");
    }


    const handleToggle = () => {
        if (!autoSendEnabled) {
            // If currently off, turning it on — show modal first
            setShowModal(true);
        } else {
            // If currently on, turning off immediately, no modal needed
            setAutoSendEnabled(false);
            sendAutoSendPreference(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleConfirm = async () => {
        try {
            // send your data to server here
            sendAutoSendPreference(true);
            setShowModal(false);
            setAutoSendEnabled(true); // confirm toggle ON
        } catch {
            // handle error (optional)
        }
    };

    async function sendAutoSendPreference(sender: boolean) {
        try {
            const localToken = localStorage.getItem("tracebit_token");
            const response = await fetch(`${BACKEND_URL}/api/autosend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localToken}`,
            },
            body: JSON.stringify({ autosend: sender }),
            });

            if (response.ok) {
            setPasswordMessage("");
            setPasswordMessageType("");
            // Optionally:
            // setPasswordMessage("Preference updated successfully!");
            // setPasswordMessageType("success");
            } else {
            const errorData = await response.json();
            setPasswordMessage(`Error: ${errorData.detail || "Failed to update preference."}`);
            setPasswordMessageType("error");
            }
        } catch {
            setPasswordMessage("Network error: Could not update preference.");
            setPasswordMessageType("error");
        }
        }







    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">

            {/* Account Details Box */}
            <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
                <h1 className="text-3xl font-bold mb-6">Account Details</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex items-center space-x-4">
                    <label className="block text-lg font-semibold mb-1 w-32" htmlFor="email">
                    Email
                    </label>
                    <input
                    id="email"
                    type="email"
                    value={email ?? ""}
                    readOnly
                    className="flex-grow border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <label className="block text-lg font-semibold mb-1 w-32" htmlFor="fullName">
                    Name
                    </label>
                    <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="flex-grow border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <label className="block text-lg font-semibold mb-1 w-32" htmlFor="username">
                    Username    
                    </label>
                    <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="flex-grow border border-gray-300 rounded p-2"
                    />
                </div>

                <fieldset className="border border-gray-300 rounded p-4">
                    <legend className="text-lg font-semibold mb-4">Change Password</legend>

                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="oldPassword">
                        Old Password
                        </label>
                        <input
                        id="oldPassword"
                        type="password"
                        value={oldpassword}
                        onChange={(e) => setoldPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter your current password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="password">
                        New Password
                        </label>
                        <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Leave empty to keep current password"
                        />
                    </div>

                    <div>
                        <label className="block mb-1" htmlFor="confirmPassword">
                        Confirm New Password
                        </label>
                        <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Repeat new password"
                        />
                    </div>
                    </fieldset>

                    {message && (
                    <p className={`text-sm mt-2 ${messageType === "error" ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                    )}
                    {nameMessage && (
                    <p className={`text-sm ${nameMessageType === "error" ? "text-red-600" : "text-green-600"}`}>
                        {nameMessage}
                    </p>
                    )}
                    {usernameMessage && (
                    <p className={`text-sm ${usernameMessageType === "error" ? "text-red-600" : "text-green-600"}`}>
                        {usernameMessage}
                    </p>
                    )}
                    {passwordMessage && (
                    <p className={`text-sm ${passwordMessageType === "error" ? "text-red-600" : "text-green-600"}`}>
                        {passwordMessage}
                    </p>
                    )}


                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
                </form>
            </div>

            {/* Fingerprint Section */}
            <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-bold mb-4">Fingerprint</h2>

                <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Send data to server automatically</span>
                <label className="switch relative inline-block w-11 h-6 cursor-pointer">
                <input
                    type="checkbox"
                    checked={autoSendEnabled}
                    onChange={handleToggle}
                    className="opacity-0 w-0 h-0 peer"
                />
                <span className="slider absolute left-0 top-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-600"></span>
                <span className="slider-knob absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></span>
                </label>


                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
                    <h3 className="text-lg font-semibold mb-4">Confirm Automatic Data Sending</h3>
                    <p className="mb-4">
                        By enabling this option, your fingerprint data will <strong>always</strong> be sent automatically to the server. Please review our{' '}
                        <Link
                        href="/pages/terms_and_conditions"
                        className="text-blue-600 underline"
                        
                        >
                        terms and conditions
                        </Link>{' '}
                        before confirming.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 rounded"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                        Confirm & Enable
                        </button>
                    </div>
                    </div>
                </div>
                )}

            </div>


    );
}

