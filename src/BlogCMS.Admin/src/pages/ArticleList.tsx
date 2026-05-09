import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { articlesApi, jobsApi } from '../services/api';
import type { ArticleListItem, PublishJob } from '../types';
import { ArticleStatus } from '../types';

const { Title, Text } = Typography;

const statusMap: Record<ArticleStatus, { color: string; text: string }> = {
  [ArticleStatus.Draft]: { color: 'default', text: 'Draft' },
  [ArticleStatus.Published]: { color: 'green', text: 'Published' },
  [ArticleStatus.Archived]: { color: 'red', text: 'Archived' },
};

const ArticleList = () => {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadArticles = async () => {
    try {
      const data = await articlesApi.getAll();
      setArticles(data);
    } catch (error) {
      message.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await articlesApi.delete(id);
      message.success('Article deleted');
      loadArticles();
    } catch (error) {
      message.error('Failed to delete article');
    }
  };

  const handlePublish = async (id: number) => {
    setPublishingId(id);
    try {
      const job: PublishJob = await articlesApi.publish(id);
      message.info('Publishing started...');

      // Poll for job status
      const pollJob = async () => {
        const updatedJob = await jobsApi.get(job.id);
        if (updatedJob.status === 'Succeeded') {
          message.success('Article published successfully!');
          loadArticles();
          setPublishingId(null);
        } else if (updatedJob.status === 'Failed') {
          message.error(`Publish failed: ${updatedJob.errorMessage}`);
          setPublishingId(null);
        } else {
          setTimeout(pollJob, 2000);
        }
      };

      setTimeout(pollJob, 2000);
    } catch (error) {
      message.error('Failed to start publish');
      setPublishingId(null);
    }
  };

  const columns: ColumnsType<ArticleListItem> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.slug}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ArticleStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: 'Read Time',
      dataIndex: 'readTimeMinutes',
      key: 'readTimeMinutes',
      width: 100,
      render: (minutes: number) => `${minutes} min`,
    },
    {
      title: 'Date',
      dataIndex: 'publishedAt',
      key: 'date',
      width: 120,
      render: (date: string | null, record) =>
        date
          ? new Date(date).toLocaleDateString()
          : new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/articles/${record.id}/edit`)}
          />
          {record.status === ArticleStatus.Draft && (
            <Button
              type="text"
              icon={<CloudUploadOutlined />}
              loading={publishingId === record.id}
              onClick={() => handlePublish(record.id)}
            />
          )}
          <Popconfirm
            title="Delete this article?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Articles
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/articles/new')}
        >
          New Article
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ArticleList;
