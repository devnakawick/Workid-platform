import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { mockDocuments } from '@/lib/mockData';

const DOCUMENT_TYPES = {
    resume: { label: 'documents.resume', color: 'bg-blue-100 text-blue-700' },
    certification: { label: 'documents.certification', color: 'bg-green-100 text-green-700' },
    portfolio: { label: 'documents.portfolio', color: 'bg-purple-100 text-purple-700' },
    id: { label: 'documents.id', color: 'bg-orange-100 text-orange-700' },
    other: { label: 'documents.other', color: 'bg-gray-100 text-gray-700' }
};

export default function Documents() {
    const { t, i18n } = useTranslation();
    const [documents, setDocuments] = useState(mockDocuments);

    const handleDelete = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        toast.success(t('documents.delete_success')); // Add to i18n? or use generic
    };

    const handleUpload = () => {
        toast.info(t('documents.upload_mock')); // Add to i18n?
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' ' + t('common.units.b');
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' ' + t('common.units.kb');
        return (bytes / 1048576).toFixed(1) + ' ' + t('common.units.mb');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('documents.title')}</h1>
                        <p className="text-gray-600">{t('documents.subtitle')}</p>
                    </div>
                    <Button onClick={handleUpload}>
                        <Upload className="w-4 h-4 mr-2" />
                        {t('documents.upload')}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {Object.entries(DOCUMENT_TYPES).map(([key, value]) => {
                        const count = documents.filter(d => d.type === key).length;
                        return (
                            <Card key={key} className="shadow-sm border-gray-200">
                                <CardContent className="p-5 text-center">
                                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm font-medium text-gray-600 mt-1">{t(value.label)}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Documents Grid */}
                {documents.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('documents.noDocs')}</h3>
                            <p className="text-gray-600 mb-4">{t('documents.startUploading')}</p>
                            <Button onClick={handleUpload}>
                                <Upload className="w-4 h-4 mr-2" />
                                {t('documents.uploadFirst')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc, idx) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 line-clamp-1">
                                                    {t(`mock.documents.${doc.name}`, doc.name)}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {doc.file_type.toUpperCase()} • {formatFileSize(doc.size)}
                                                </p>
                                            </div>
                                            <Badge className={DOCUMENT_TYPES[doc.type]?.color || DOCUMENT_TYPES.other.color} variant="secondary">
                                                {t(DOCUMENT_TYPES[doc.type]?.label || 'documents.other')}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {t('documents.uploaded', { date: new Date(doc.uploaded_date).toLocaleDateString(i18n.language) })}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Download className="w-4 h-4 mr-2" />
                                            {t('documents.download')}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}