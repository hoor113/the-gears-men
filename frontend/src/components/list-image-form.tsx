import { Button, Grid, IconButton, ImageList, ImageListItem } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    control: any;
    name: string;
    label?: string;
};

type PreviewItem = {
    type: 'url' | 'file';
    value: string | File;
};

export default function ListImageForm({ control, name, label }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<PreviewItem[]>([]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => {
                // Chuyển đổi default value nếu là array chứa url
                useEffect(() => {
                    if (value && value.length > 0) {
                        const previewItems: PreviewItem[] = value.map((item: any) =>
                            typeof item === 'string'
                                ? { type: 'url', value: item }
                                : { type: 'file', value: item }
                        );
                        setPreviews(previewItems);
                    }
                }, [value]);

                const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (!files) return;

                    const newItems: PreviewItem[] = Array.from(files).map((file) => ({
                        type: 'file',
                        value: file,
                    }));

                    const updated = [...previews, ...newItems];
                    setPreviews(updated);
                    onChange(updated.map((item) => item.value));
                };

                const handleRemove = (index: number) => {
                    const updated = previews.filter((_, i) => i !== index);
                    setPreviews(updated);
                    onChange(updated.map((item) => item.value));
                };

                return (
                    <Grid container spacing={1}>
                        {label && (
                            <Grid item xs={12}>
                                <strong>{label}</strong>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Tải ảnh lên
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleFilesSelected}
                            />
                        </Grid>

                        {previews.length > 0 && (
                            <Grid item xs={12}>
                                <ImageList cols={4} rowHeight={120}>
                                    {previews.map((item, index) => {
                                        const src =
                                            item.type === 'url'
                                                ? item.value as string
                                                : URL.createObjectURL(item.value as File);
                                        return (
                                            <ImageListItem key={index}>
                                                <img
                                                    src={src}
                                                    alt={`img-${index}`}
                                                    loading="lazy"
                                                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                />
                                                <IconButton
                                                    onClick={() => handleRemove(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                                        color: 'white',
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </ImageListItem>
                                        );
                                    })}
                                </ImageList>
                            </Grid>
                        )}
                    </Grid>
                );
            }}
        />
    );
}
