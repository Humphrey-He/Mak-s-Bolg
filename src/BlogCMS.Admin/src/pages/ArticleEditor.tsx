import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Typography,
  Row,
  Col,
  Switch,
} from 'antd';
import { SaveOutlined, CloudUploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { articlesApi, jobsApi } from '../services/api';
import type { Article, CreateArticleRequest, PublishJob } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [article, setArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(parseInt(id));
    }
  }, [id]);

  const loadArticle = async (articleId: number) => {
    try {
      const data = await articlesApi.getBySlug(articleId.toString());
      setArticle(data);
      form.setFieldsValue({
        title: data.title,
        slug: data.slug,
        description: data.description,
        tag: data.tag,
        content: data.content,
        isTop: data.isTop,
        isFeatured: data.isFeatured,
      });
    } catch (error) {
      message.error('Failed to load article');
    } finally {
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (isEditing && article) {
        await articlesApi.update(article.id, {
          title: values.title,
          description: values.description,
          tag: values.tag,
          content: values.content,
          isTop: values.isTop,
          isFeatured: values.isFeatured,
        });
        message.success('Article saved');
      } else {
        const slug = values.slug || generateSlug(values.title);
        const request: CreateArticleRequest = {
          title: values.title,
          slug,
          description: values.description || '',
          tag: values.tag || '',
          content: values.content || '',
          isTop: values.isTop || false,
          isFeatured: values.isFeatured || false,
        };
        const newArticle = await articlesApi.create(request);
        message.success('Article created');
        navigate(`/articles/${newArticle.id}/edit`, { replace: true });
      }
    } catch (error) {
      message.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!article) {
      // Save first
      await handleSave();
      return;
    }

    setPublishing(true);
    try {
      const job: PublishJob = await articlesApi.publish(article.id);
      message.info('Publishing started...');

      const pollJob = async () => {
        const updatedJob = await jobsApi.get(job.id);
        if (updatedJob.status === 'Succeeded') {
          message.success('Article published successfully!');
          loadArticle(article.id);
          setPublishing(false);
        } else if (updatedJob.status === 'Failed') {
          message.error(`Publish failed: ${updatedJob.errorMessage}`);
          setPublishing(false);
        } else {
          setTimeout(pollJob, 2000);
        }
      };

      setTimeout(pollJob, 2000);
    } catch (error) {
      message.error('Failed to start publish');
      setPublishing(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/articles')}
        >
          Back
        </Button>
      </Space>

      <Title level={3}>{isEditing ? 'Edit Article' : 'New Article'}</Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isTop: false,
          isFeatured: false,
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card style={{ marginBottom: 16 }}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input placeholder="Article title" size="large" />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Slug is required' }]}
              >
                <Input placeholder="article-slug" />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <TextArea
                  rows={2}
                  placeholder="Brief description"
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item name="content" label="Content">
                <TextArea
                  rows={20}
                  placeholder="Write your article content in Markdown..."
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ marginBottom: 16 }}>
              <Form.Item name="tag" label="Tag">
                <Input placeholder="Go / Cache" />
              </Form.Item>

              <Form.Item name="isTop" label="Pin to top" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
                <Switch />
              </Form.Item>

              <div style={{ marginTop: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={saving}
                    block
                  >
                    Save Draft
                  </Button>
                  <Button
                    icon={<CloudUploadOutlined />}
                    onClick={handlePublish}
                    loading={publishing}
                    block
                  >
                    Publish
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ArticleEditor;
