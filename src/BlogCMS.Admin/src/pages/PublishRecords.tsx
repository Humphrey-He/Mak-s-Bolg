import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Spin, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { jobsApi } from '../services/api';
import type { PublishJobListItem } from '../types';

const { Title, Text, Link } = Typography;

const PublishRecords = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<PublishJobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const data = await jobsApi.getAll();
      setJobs(data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Succeeded':
        return { color: 'green', text: t('publishRecords.statusSuccess') };
      case 'Failed':
        return { color: 'red', text: t('publishRecords.statusFailed') };
      case 'Pending':
      case 'Running':
        return { color: 'blue', text: t('publishRecords.statusRunning') };
      default:
        return { color: 'default', text: status };
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('publishRecords.justNow');
    if (diffMins < 60) return t('publishRecords.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('publishRecords.hoursAgo', { count: diffHours });
    if (diffDays < 30) return t('publishRecords.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const getCommitLink = (commitSha: string | null) => {
    if (!commitSha) return <Text type="secondary">-</Text>;
    const href = `https://github.com/mak-blog/blog/commit/${commitSha}`;
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {commitSha.substring(0, 7)}
      </Link>
    );
  };

  const columns: ColumnsType<PublishJobListItem> = [
    {
      title: t('publishRecords.article'),
      dataIndex: 'articleTitle',
      key: 'articleTitle',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: t('publishRecords.commit'),
      dataIndex: 'commitSha',
      key: 'commitSha',
      render: (commitSha: string | null) => getCommitLink(commitSha),
    },
    {
      title: t('publishRecords.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('publishRecords.time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => formatTimeAgo(date),
    },
    {
      title: t('publishRecords.error'),
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (error: string | null) =>
        error ? <Text type="danger">{error}</Text> : <Text type="secondary">-</Text>,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          {t('publishRecords.title')}
        </Title>
      </div>

      {jobs.length === 0 ? (
        <Empty description={t('publishRecords.noRecords')} />
      ) : (
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default PublishRecords;