import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../../utils/api';

function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        info: '',
        password: '',
        photoUrl: '',
        socialLinks: []
    });

    useEffect(() => {
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch profile');
                return res.json();
            })
            .then(data => {
                setFormData({
                    username: data.username || '',
                    name: data.name || '',
                    info: data.info || '',
                    password: '',
                    photoUrl: data.photoUrl || '',
                    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : []
                });
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (index, field, value) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const addSocialLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { platform: '', url: '' }]
        });
    };

    const removeSocialLink = (index) => {
        const newLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, photoUrl: previewUrl });
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile) {
            alert('Please select a photo first');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('photo', selectedFile);

        setUploading(true);

        try {
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/users/upload-photo`,
                {
                    method: 'POST',
                    body: formDataToSend
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert('Photo uploaded successfully!');
                // Backend now returns full URL, use it directly
                setFormData({ ...formData, photoUrl: data.photoUrl });
                setSelectedFile(null);
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        setIsLoading(true);

        // Filter out empty password and invalid social links
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        // Remove social links that don't have both platform and url
        payload.socialLinks = payload.socialLinks.filter(link => link.platform && link.url);

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.ok) {
                    alert('Profile updated successfully!');
                } else {
                    // Try to parse error message
                    res.json().then(err => {
                        console.error('Update failed:', err);
                        alert(`Failed to update profile: ${err.message || 'Unknown error'}`);
                    }).catch(() => alert('Failed to update profile'));
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            <header className="flex items-center justify-between sticky top-0 bg-[#32272e] z-20 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f7afb7]">settings</span>
                    <h2 className="text-2xl font-['Outfit'] font-bold text-white">Dashboard Settings</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white transition-colors">Discard Changes</button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-[#f7afb7] text-[#2c242a] px-8 py-3 rounded-xl flex items-center gap-2 text-sm uppercase tracking-wider font-extrabold hover:brightness-105 transition-all shadow-[0_4px_14px_0_rgba(247,175,183,0.3)]"
                    >
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </header>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#f7afb7]">person_edit</span>
                    <h3 className="text-xl font-bold font-['Outfit'] text-white">Profile Customization</h3>
                </div>
                <div className="bg-[#3a2f3c] p-8 rounded-[1.5rem] relative border-2 border-transparent mt-3">
                    {/* Decorative ears */}
                    <div className="absolute -top-3 left-6 w-6 h-4 bg-[#3a2f3c]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                    <div className="absolute -top-3 right-6 w-6 h-4 bg-[#3a2f3c]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>

                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="flex flex-col items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                id="photo-upload"
                                className="hidden"
                            />
                            <label htmlFor="photo-upload" className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#f7afb7] relative bg-[#2c242a]">
                                    {formData.photoUrl ? (
                                        <img alt="Profile" className="w-full h-full object-cover" src={formData.photoUrl} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <span className="material-symbols-outlined text-4xl">pets</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="material-symbols-outlined text-white">photo_camera</span>
                                    </div>
                                    <div className="absolute -top-2 left-4 w-6 h-4 bg-[#f7afb7]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                                    <div className="absolute -top-2 right-4 w-6 h-4 bg-[#f7afb7]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                                </div>
                            </label>
                            <p className="text-[10px] text-white uppercase font-black tracking-widest">
                                {selectedFile ? selectedFile.name : 'Click to Select Photo'}
                            </p>
                            {selectedFile && (
                                <button
                                    onClick={handlePhotoUpload}
                                    disabled={uploading}
                                    className="bg-[#f7afb7] text-[#2c242a] px-6 py-2 rounded-lg text-xs font-bold hover:brightness-105 transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white ml-1">Username</label>
                                    <input
                                        className="w-full bg-[#2c242a]/50 border border-[#f7afb7]/10 rounded-xl p-3 text-lg font-bold text-white/50 focus:border-[#f7afb7]/30 outline-none cursor-not-allowed"
                                        name="username"
                                        type="text"
                                        value={formData.username || ''}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white ml-1">Display Name</label>
                                    <input
                                        className="w-full bg-[#2c242a] border border-[#f7afb7]/20 rounded-xl p-3 text-lg font-bold text-white focus:border-[#f7afb7] outline-none"
                                        name="name"
                                        placeholder="Enter display name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white ml-1">Update Password</label>
                                    <input
                                        className="w-full bg-[#2c242a] border border-[#f7afb7]/20 rounded-xl p-3 text-white focus:border-[#f7afb7] outline-none"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white ml-1">Streamer Bio</label>
                                <textarea
                                    className="w-full bg-[#2c242a] border border-[#f7afb7]/20 rounded-xl p-3 text-base text-white focus:border-[#f7afb7] outline-none min-h-[120px] resize-none"
                                    name="info"
                                    placeholder="Tell your viewers about yourself..."
                                    value={formData.info}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#f7afb7]">share</span>
                    <h3 className="text-xl font-bold font-['Outfit'] text-white">Social Link Management</h3>
                </div>
                <div className="bg-[#3a2f3c] p-8 rounded-[1.5rem] relative border-2 border-transparent mt-3">
                    <div className="absolute -top-3 left-6 w-6 h-4 bg-[#3a2f3c]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                    <div className="absolute -top-3 right-6 w-6 h-4 bg-[#3a2f3c]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.socialLinks.map((link, idx) => (
                            <div key={idx} className="space-y-4 bg-[#2c242a] p-4 rounded-2xl border border-white/10 group focus-within:border-[#f7afb7]/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#f7afb7] text-sm">link</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Social Platform {idx + 1}</span>
                                    </div>
                                    <button onClick={() => removeSocialLink(idx)} className="text-[#ad6d94] hover:text-red-400 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <select
                                            className="w-full bg-[#32272e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#f7afb7] outline-none cursor-pointer"
                                            value={link.platform}
                                            onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                                        >
                                            <option value="" disabled>Select Platform</option>
                                            <option value="twitch">Twitch</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="discord">Discord</option>
                                            <option value="tiktok">tiktok</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            className="w-full bg-[#32272e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#f7afb7] outline-none"
                                            placeholder="URL"
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addSocialLink}
                        className="w-full mt-8 py-3 border-2 border-dashed border-[#f7afb7]/30 rounded-2xl text-white font-bold text-sm hover:border-[#f7afb7]/50 hover:bg-white/5 transition-all"
                    >
                        + Add New Social Link
                    </button>
                </div>
            </section>


        </div>
    );
}

export default Settings;
