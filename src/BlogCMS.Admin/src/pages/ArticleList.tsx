import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Popconfirm,
  message,
  Select,
  Spin,
  Card,
  Input,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { articlesApi, jobsApi, tagsApi } from '../services/api';
import type { ArticleListItem, PublishJob, Tag as TagType } from '../types';
import { ArticleStatus } from '../types';

const { Title, Text } = Typography;

type SortOption = 'updatedAt' | 'createdAt' | 'title';

const ArticleList = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const navigate = useNavigate();

  const statusMap: Record<ArticleStatus, { color: string; text: string }> = {
    [ArticleStatus.Draft]: { color: '#8c8c8f', text: t('article.status.draft') },
    [ArticleStatus.Publishing]: { color: '#1890ff', text: t('article.status.publishing') },
    [ArticleStatus.Published]: { color: '#52c41a', text: t('article.status.published') },
    [ArticleStatus.Failed]: { color: '#ff4d4f', text: t('article.status.failed') },
    [ArticleStatus.Archived]: { color: 'red', text: t('article.status.archived') },
  };

  const loadArticles = async () => {
    try {
      const data = await articlesApi.getAll();
      setArticles(data);
    } catch {
      message.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const data = await tagsApi.getAll();
      setTags(data);
    } catch {
      // silently fail for tags
    }
  };

  useEffect(() => {
    loadArticles();
    loadTags();
  }, [t]);

  const handleDelete = async (id: number) => {
    try {
      await articlesApi.delete(id);
      message.success(t('article.deleteSuccess'));
      loadArticles();
    } catch {
      message.error(t('errors.deleteFailed'));
    }
  };

  const handlePublish = async (id: number) => {
    setPublishingId(id);
    try {
      await articlesApi.update(id, { status: ArticleStatus.Publishing } as any);
      loadArticles();

      const job: PublishJob = await articlesApi.publish(id);
      message.info(t('article.publishing'));

      const pollJob = async () => {
        const updatedJob = await jobsApi.get(job.id);
        if (updatedJob.status === 'Succeeded') {
          await articlesApi.update(id, { status: ArticleStatus.Published } as any);
          message.success(`${t('article.published')}: ${updatedJob.commitSha}`);
          loadArticles();
          setPublishingId(null);
        } else if (updatedJob.status === 'Failed') {
          await articlesApi.update(id, { status: ArticleStatus.Failed } as any);
          message.error(`${t('article.publishFailed')}: ${updatedJob.errorMessage}`);
          loadArticles();
          setPublishingId(null);
        } else {
          setTimeout(pollJob, 2000);
        }
      };

      setTimeout(pollJob, 2000);
    } catch {
      message.error(t('article.publishFailed'));
      setPublishingId(null);
      loadArticles();
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: articles.length,
      published: articles.filter(a => a.status === ArticleStatus.Published).length,
      draft: articles.filter(a => a.status === ArticleStatus.Draft).length,
      thisMonth: articles.filter(a => new Date(a.createdAt) >= startOfMonth).length,
    };
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Apply status filter
    if (statusFilter !== null) {
      result = result.filter(a => a.status === statusFilter);
    }

    // Apply tag filter
    if (tagFilter !== null) {
      result = result.filter(a => a.tag === tagFilter);
    }

    // Apply search
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(lower) ||
          a.slug.toLowerCase().includes(lower) ||
          a.description.toLowerCase().includes(lower) ||
          a.tag.toLowerCase().includes(lower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [articles, statusFilter, tagFilter, searchText, sortBy]);

  const columns: ColumnsType<ArticleListItem> = [
    {
      title: t('common.title'),
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
      title: t('article.tag'),
      dataIndex: 'tag',
      key: 'tag',
      width: 150,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ArticleStatus) => (
        <Tag color={statusMap[status].color}>
          {status === ArticleStatus.Publishing ? (
            <Space>
              <Spin size="small" indicator={<LoadingOutlined spin />} />
              {statusMap[status].text}
            </Space>
          ) : (
            statusMap[status].text
          )}
        </Tag>
      ),
    },
    {
      title: t('article.readTime'),
      dataIndex: 'readTimeMinutes',
      key: 'readTimeMinutes',
      width: 100,
      render: (minutes: number) => `${minutes} ${t('article.minutes')}`,
    },
    {
      title: t('common.date'),
      dataIndex: 'publishedAt',
      key: 'date',
      width: 120,
      render: (date: string | null, record) =>
        date
          ? new Date(date).toLocaleDateString()
          : new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title={t('article.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/articles/${record.id}/edit`)}
            />
          </Tooltip>
          {(record.status === ArticleStatus.Draft || record.status === ArticleStatus.Failed || record.status === ArticleStatus.Publishing) && (
            <Tooltip title={t('article.publish')}>
              <Button
                type="text"
                icon={<CloudUploadOutlined />}
                loading={publishingId === record.id}
                onClick={() => handlePublish(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title={t('article.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.delete')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('common.delete')}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
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
          {t('article.articleList')}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/articles/new')}
        >
          {t('article.newArticle')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Text type="secondary">{t('article.total')}</Text>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.total}</div>
        </Card>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Text type="secondary">{t('article.published')}</Text>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{stats.published}</div>
        </Card>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Text type="secondary">{t('article.draft')}</Text>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8c8c8f' }}>{stats.draft}</div>
        </Card>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Text type="secondary">{t('article.thisMonth')}</Text>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{stats.thisMonth}</div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder={t('article.search')}
          style={{ width: 200 }}
          onSearch={setSearchText}
          allowClear
        />
        <Select
          placeholder={t('article.status')}
          style={{ width: 120 }}
          allowClear
          value={statusFilter}
          onChange={(val) => setStatusFilter(val ?? null)}
        >
          <Select.Option value={ArticleStatus.Draft}>{t('article.status.draft')}</Select.Option>
          <Select.Option value={ArticleStatus.Published}>{t('article.status.published')}</Select.Option>
          <Select.Option value={ArticleStatus.Failed}>{t('article.status.failed')}</Select.Option>
        </Select>
        <Select
          placeholder={t('article.tag')}
          style={{ width: 120 }}
          allowClear
          value={tagFilter}
          onChange={(val) => setTagFilter(val ?? null)}
        >
          {tags.map(tag => (
            <Select.Option key={tag.slug} value={tag.name}>
              {tag.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder={t('article.sort')}
          style={{ width: 120 }}
          value={sortBy}
          onChange={setSortBy}
        >
          <Select.Option value="updatedAt">{t('article.sortUpdated')}</Select.Option>
          <Select.Option value="createdAt">{t('article.sortCreated')}</Select.Option>
          <Select.Option value="title">{t('article.sortTitle')}</Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredArticles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ArticleList;
