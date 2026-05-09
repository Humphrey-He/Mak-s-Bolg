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
  AutoComplete,
  Modal,
  Image,
} from 'antd';
import { SaveOutlined, CloudUploadOutlined, ArrowLeftOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { articlesApi, jobsApi, tagsApi, mediaApi } from '../services/api';
import type { Article, CreateArticleRequest, PublishJob, Tag, MediaItem } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [article, setArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState<Tag[]>([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [coverImageModalVisible, setCoverImageModalVisible] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | undefined>();

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(parseInt(id));
    }
  }, [id]);

  const loadTags = async () => {
    try {
      const data = await tagsApi.getAll();
      setTags(data);
    } catch {
      // Ignore errors
    }
  };

  const loadArticle = async (articleId: number) => {
    try {
      const data = await articlesApi.getBySlug(articleId.toString());
      setArticle(data);
      setSelectedCoverImage(data.coverImageUrl);
      form.setFieldsValue({
        title: data.title,
        slug: data.slug,
        description: data.description,
        tag: data.tag,
        content: data.content,
        isTop: data.isTop,
        isFeatured: data.isFeatured,
        coverImageUrl: data.coverImageUrl,
      });
    } catch (error) {
      message.error('Failed to load article');
    }
  };

  const loadMedia = async () => {
    try {
      const data = await mediaApi.getAll(1, 50);
      setMedia(data.items);
    } catch {
      message.error('Failed to load media');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const request = {
        title: values.title,
        description: values.description || '',
        tag: values.tag || '',
        content: values.content || '',
        coverImageUrl: selectedCoverImage || undefined,
        isTop: values.isTop || false,
        isFeatured: values.isFeatured || false,
      };

      if (isEditing && article) {
        await articlesApi.update(article.id, request);
        message.success('Article saved');
      } else {
        const slug = values.slug || generateSlug(values.title);
        const createRequest: CreateArticleRequest = {
          ...request,
          slug,
        };
        const newArticle = await articlesApi.create(createRequest);
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

  const handleInsertImage = (url: string) => {
    const content = form.getFieldValue('content') || '';
    const imageMarkdown = `![Image](${url})`;
    form.setFieldValue('content', content + '\n' + imageMarkdown + '\n');
    setMediaModalVisible(false);
  };

  const handleSelectCoverImage = (url: string) => {
    setSelectedCoverImage(url);
    form.setFieldValue('coverImageUrl', url);
    setCoverImageModalVisible(false);
  };

  const tagOptions = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

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

              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  loadMedia();
                  setMediaModalVisible(true);
                }}
              >
                Insert Image
              </Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ marginBottom: 16 }}>
              <Form.Item name="tag" label="Tag">
                <AutoComplete
                  options={tagOptions}
                  placeholder="Select or type a tag"
                  value={form.getFieldValue('tag')}
                  onChange={(value) => form.setFieldValue('tag', value)}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item name="coverImage" label="Cover Image">
                <div>
                  {selectedCoverImage ? (
                    <div style={{ marginBottom: 8 }}>
                      <Image
                        src={selectedCoverImage}
                        alt="Cover"
                        style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: 100,
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                        borderRadius: 4,
                      }}
                    >
                      <Text type="secondary">No cover image</Text>
                    </div>
                  )}
                  <Button
                    icon={<PictureOutlined />}
                    onClick={() => {
                      loadMedia();
                      setCoverImageModalVisible(true);
                    }}
                    block
                  >
                    {selectedCoverImage ? 'Change Cover' : 'Select Cover'}
                  </Button>
                </div>
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

      {/* Media Selection Modal for Insert Image */}
      <Modal
        title="Insert Image"
        open={mediaModalVisible}
        onCancel={() => setMediaModalVisible(false)}
        footer={null}
        width={800}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 12,
            marginTop: 16,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => handleInsertImage(item.url)}
            >
              <img
                src={item.url}
                alt={item.originalName}
                style={{ width: '100%', height: 80, objectFit: 'cover' }}
              />
              <div
                style={{
                  padding: 4,
                  fontSize: 10,
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.originalName}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Media Selection Modal for Cover Image */}
      <Modal
        title="Select Cover Image"
        open={coverImageModalVisible}
        onCancel={() => setCoverImageModalVisible(false)}
        footer={null}
        width={800}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 12,
            marginTop: 16,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                border: selectedCoverImage === item.url ? '2px solid #1890ff' : '1px solid #f0f0f0',
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => handleSelectCoverImage(item.url)}
            >
              <img
                src={item.url}
                alt={item.originalName}
                style={{ width: '100%', height: 80, objectFit: 'cover' }}
              />
              <div
                style={{
                  padding: 4,
                  fontSize: 10,
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.originalName}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ArticleEditor;
