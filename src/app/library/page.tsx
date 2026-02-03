'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Upload, Search, FileText, Download, X, Plus, Library, Users, Eye } from 'lucide-react';
import styles from './library.module.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Resource {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    category: string;
    createdAt: string;
}

export default function LibraryPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);

    // Form states
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [formCategory, setFormCategory] = useState('Computer Science');

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/resources?q=${search}&category=${category}`);
            const data = await res.json();
            setResources(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [search, category]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResources();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchResources]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchResources();
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('category', formCategory);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setIsUploadOpen(false);
                fetchResources();
                // Reset form
                setFile(null);
                setTitle('');
                setDesc('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const stats = useMemo(() => {
        return {
            total: resources.length,
            categories: new Set(resources.map(r => r.category)).size,
            recent: resources.filter(r => {
                const date = new Date(r.createdAt);
                const now = new Date();
                return (now.getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
            }).length
        };
    }, [resources]);

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header className={styles.libraryHeader}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <BookOpen className="text-primary" />
                    <h1 className="font-display">UniLib Library</h1>
                </Link>
                <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
                    <Plus size={20} /> Upload Material
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.statsContainer}
            >
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Resources</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.categories}</span>
                    <span className={styles.statLabel}>Categories</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.recent}</span>
                    <span className={styles.statLabel}>New Today</span>
                </div>
            </motion.div>

            <div className={styles.searchBar}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search for books, notes, or research papers..."
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? '...' : <Search size={20} />}
                    </button>
                </form>
            </div>

            <div className={styles.categoryContainer}>
                {[
                    { name: 'All', icon: <BookOpen className={styles.categoryIcon} /> },
                    { name: 'Computer Science', icon: <Library className={styles.categoryIcon} /> },
                    { name: 'Mathematics', icon: <FileText className={styles.categoryIcon} /> },
                    { name: 'Physics', icon: <Search className={styles.categoryIcon} /> },
                    { name: 'Business', icon: <Users className={styles.categoryIcon} /> },
                    { name: 'Literature', icon: <Plus className={styles.categoryIcon} /> }
                ].map((cat) => (
                    <div
                        key={cat.name}
                        className={`${styles.categoryCard} glass ${category === cat.name ? styles.active : ''}`}
                        onClick={() => setCategory(cat.name)}
                    >
                        {cat.icon}
                        <span className={styles.categoryLabel}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Fetching academic repository...</p>
                </div>
            ) : resources.length > 0 ? (
                <motion.div
                    layout
                    className={styles.grid}
                >
                    <AnimatePresence mode="popLayout">
                        {resources.map((res, index) => (
                            <motion.div
                                key={res.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={`${styles.resourceCard} glass`}
                            >
                                <div className={styles.resourceIcon}>
                                    {res.fileType.includes('pdf') ? <FileText color="#ef4444" /> :
                                        res.fileType.includes('image') ? <Library color="#10b981" /> :
                                            <BookOpen color="var(--primary)" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className={styles.resourceTitle}>{res.title}</h3>
                                    <p className={styles.resourceDescription}>
                                        {res.description || 'Premium academic resource available for download.'}
                                    </p>
                                </div>
                                <div className={styles.resourceMeta}>
                                    <span className={styles.badge}>{res.category}</span>
                                    <span style={{ opacity: 0.6 }}>{new Date(res.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => setPreviewResource(res)}
                                        className="btn-primary"
                                        style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Eye size={18} /> Preview
                                    </button>
                                    <a href={res.fileUrl} download className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                        <Download size={18} /> Download
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className={styles.emptyState}>
                    <Search size={48} opacity={0.3} />
                    <h3>No resources found</h3>
                    <p>Try adjusting your search or category filters to find what you're looking for.</p>
                </div>
            )}

            {isUploadOpen && (
                <div className={styles.uploadOverlay}>
                    <div className={`${styles.uploadModal} glass`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="font-display">Upload Resource</h2>
                            <X style={{ cursor: 'pointer' }} onClick={() => setIsUploadOpen(false)} />
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className={styles.formGroup}>
                                <label>Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Intro to Algorithms" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                    <option>Computer Science</option>
                                    <option>Mathematics</option>
                                    <option>Physics</option>
                                    <option>Business</option>
                                    <option>Literature</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Briefly describe the content..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label>File</label>
                                <div className={styles.fileInput} onClick={() => document.getElementById('file-upload')?.click()}>
                                    {file ? file.name : 'Click to select or drag and drop'}
                                    <input
                                        type="file"
                                        id="file-upload"
                                        hidden
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                                Complete Upload
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {previewResource && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.previewOverlay}
                        onClick={() => setPreviewResource(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={styles.previewModal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.previewHeader}>
                                <h2 className="font-display">{previewResource.title}</h2>
                                <button className="btn-primary" onClick={() => setPreviewResource(null)} style={{ padding: '0.5rem' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className={styles.previewContent}>
                                {previewResource.fileType.includes('pdf') ? (
                                    <iframe src={previewResource.fileUrl} className={styles.previewIframe} />
                                ) : previewResource.fileType.includes('image') ? (
                                    <img src={previewResource.fileUrl} alt={previewResource.title} className={styles.previewImage} />
                                ) : (
                                    <div className={styles.emptyState}>
                                        <FileText size={48} />
                                        <p>Preview not available for this file type.</p>
                                        <a href={previewResource.fileUrl} download className="btn-primary">
                                            Download to View
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
