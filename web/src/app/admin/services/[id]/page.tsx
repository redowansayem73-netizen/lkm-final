'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ServiceEditor from "@/components/admin/ServiceEditor";

export default function EditServicePage() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchService() {
            try {
                const res = await fetch(`/api/admin/services/${params.id}`);
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchService();
    }, [params.id]);

    if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;
    if (!data) return <div className="flex items-center justify-center py-20 text-red-500">Service not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <ServiceEditor initialData={data} isEditing />
        </div>
    );
}
