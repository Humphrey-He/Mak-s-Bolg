import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Popconfirm,
  message,
  Tag as AntTag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { tagsApi } from '../services/api';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../types';

const { Title } = Typography;

const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await tagsApi.getAll();
      setTags(data);
    } catch {
      message.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name, slug: tag.slug });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tagsApi.delete(id);
      message.success('Tag deleted');
      loadTags();
    } catch {
      message.error('Failed to delete tag');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTag) {
        const request: UpdateTagRequest = { name: values.name, slug: values.slug };
        await tagsApi.update(editingTag.id, request);
        message.success('Tag updated');
      } else {
        const request: CreateTagRequest = { name: values.name, slug: values.slug };
        await tagsApi.create(request);
        message.success('Tag created');
      }
      setModalVisible(false);
      loadTags();
    } catch (error) {
      message.error(editingTag ? 'Failed to update tag' : 'Failed to create tag');
    }
  };

  const handleUpdateCounts = async () => {
    try {
      await tagsApi.updateCounts();
      message.success('Article counts updated');
      loadTags();
    } catch {
      message.error('Failed to update counts');
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <AntTag>{slug}</AntTag>,
    },
    {
      title: 'Article Count',
      dataIndex: 'articleCount',
      key: 'articleCount',
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Tag) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete tag"
            description="Are you sure you want to delete this tag?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Tag Management</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleUpdateCounts}>
            Update Counts
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            New Tag
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingTag ? 'Edit Tag' : 'New Tag'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingTag ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input
              placeholder="Tag name"
              onChange={(e) => {
                if (!editingTag) {
                  form.setFieldValue('slug', generateSlug(e.target.value));
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Slug is required' }]}
          >
            <Input placeholder="tag-slug" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManager;
