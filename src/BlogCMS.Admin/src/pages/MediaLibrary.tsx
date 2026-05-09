import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Upload,
  Space,
  Typography,
  Popconfirm,
  message,
  Image,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { mediaApi } from '../services/api';
import type { MediaItem } from '../types';

const { Title } = Typography;

const { Dragger } = Upload;

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  const loadMedia = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await mediaApi.getAll(page, pagination.pageSize);
      setMedia(data.items);
      setPagination((prev) => ({ ...prev, page: data.page, total: data.total }));
    } catch {
      message.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Only image files (jpg, png, gif, webp, svg) are allowed');
      return false;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File size exceeds 5MB limit');
      return false;
    }

    setUploading(true);
    try {
      await mediaApi.upload(file);
      message.success('File uploaded successfully');
      loadMedia(1);
    } catch {
      message.error('Failed to upload file');
    } finally {
      setUploading(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleDelete = async (id: number) => {
    try {
      await mediaApi.delete(id);
      message.success('File deleted');
      loadMedia(pagination.page);
    } catch {
      message.error('Failed to delete file');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const loadMore = () => {
    if (pagination.page * pagination.pageSize < pagination.total) {
      loadMedia(pagination.page + 1);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Media Library</Title>
        <Upload
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          showUploadList={false}
          beforeUpload={handleUpload}
        >
          <Button type="primary" icon={<PlusOutlined />} loading={uploading}>
            Upload Image
          </Button>
        </Upload>
      </div>

      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div style={{ position: 'relative', paddingTop: '75%', background: '#f5f5f5' }}>
                <Image
                  src={item.url}
                  alt={item.originalName}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  preview={{ src: item.url }}
                />
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: '#666',
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.originalName}
                >
                  {item.originalName}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>
                  {formatFileSize(item.fileSize)}
                  {item.width > 0 && ` · ${item.width}×${item.height}`}
                  <br />
                  {formatDate(item.createdAt)}
                </div>
                <Space size="small">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    Copy
                  </Button>
                  <Popconfirm
                    title="Delete file"
                    description="Are you sure you want to delete this file?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          ))}
        </div>

        {media.length === 0 && !loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}
          >
            <Dragger
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              showUploadList={false}
              beforeUpload={handleUpload}
              style={{ padding: 40 }}
            >
              <PlusOutlined style={{ fontSize: 48, color: '#999' }} />
              <p style={{ marginTop: 16, color: '#666' }}>
                Click or drag images here to upload
              </p>
              <p style={{ color: '#999', fontSize: 12 }}>
                Max file size: 5MB · Supported: JPG, PNG, GIF, WebP, SVG
              </p>
            </Dragger>
          </div>
        )}

        {pagination.page * pagination.pageSize < pagination.total && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button onClick={loadMore}>Load More</Button>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default MediaLibrary;
