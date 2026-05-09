import { useState, useEffect, useRef, useCallback } from 'react';
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
  Dropdown,
  Upload,
  Tooltip,
  Collapse,
  Popconfirm,
  Alert,
  Badge,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  SaveOutlined,
  CloudUploadOutlined,
  ArrowLeftOutlined,
  PictureOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileMarkdownOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  LinkOutlined,
  SettingOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  TableOutlined,
  InsertRowAboveOutlined,
  EditOutlined,
  ColumnWidthOutlined,
  SaveFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { articlesApi, jobsApi, tagsApi, mediaApi } from '../services/api';
import type { Article, CreateArticleRequest, PublishJob, Tag, MediaItem } from '../types';
import { ArticleStatus } from '../types';
import {
  importMdFile,
  importWordFile,
  exportAsMarkdown,
  exportAsWord,
  exportAsLatex,
  generateSlug,
} from '../utils/document';

const { Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = !!id;
  const [article, setArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState<Tag[]>([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [coverImageModalVisible, setCoverImageModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | undefined>();
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef<string>('');
  const handleSaveRef = useRef<() => Promise<void>>();
  const isScrollSyncingRef = useRef(false);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(parseInt(id));
    }
  }, [id]);

  // Update content when form content changes
  useEffect(() => {
    const contentValue = form.getFieldValue('content');
    if (contentValue) {
      setContent(contentValue);
    }
  }, [content]);

  // Keep handleSaveRef updated
  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  // Track unsaved changes and auto-save
  useEffect(() => {
    const currentContent = form.getFieldValue('content') || '';
    const isDirty = currentContent !== initialContentRef.current;
    setHasUnsavedChanges(isDirty);

    // Auto-save after 3 seconds of inactivity
    if (isDirty && isEditing && handleSaveRef.current) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      const timer = setTimeout(() => {
        handleSaveRef.current?.();
      }, 3000);
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 's') {
        e.preventDefault();
        handleSave();
        return;
      }

      if (modifier && e.key === 'Enter' && article) {
        e.preventDefault();
        handlePublish();
        return;
      }

      if (modifier && e.key === 'b' && textareaRef.current) {
        e.preventDefault();
        wrapSelection('**', '**');
        return;
      }

      if (modifier && e.key === 'i' && textareaRef.current) {
        e.preventDefault();
        wrapSelection('*', '*');
        return;
      }

      if (e.key === 'Tab' && textareaRef.current) {
        e.preventDefault();
        insertSpaces(2);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article]);

  // beforeunload event for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Scroll sync for split mode
  const handleEditorScroll = useCallback(() => {
    if (editorMode !== 'split' || !textareaRef.current || !previewRef.current || isScrollSyncingRef.current) return;

    const textarea = textareaRef.current;
    const preview = previewRef.current;
    const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    isScrollSyncingRef.current = true;
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    setTimeout(() => { isScrollSyncingRef.current = false; }, 50);
  }, [editorMode]);

  const handlePreviewScroll = useCallback(() => {
    if (editorMode !== 'split' || !textareaRef.current || !previewRef.current || isScrollSyncingRef.current) return;

    const textarea = textareaRef.current;
    const preview = previewRef.current;
    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    isScrollSyncingRef.current = true;
    textarea.scrollTop = scrollPercentage * (textarea.scrollHeight - textarea.clientHeight);
    setTimeout(() => { isScrollSyncingRef.current = false; }, 50);
  }, [editorMode]);

  // Wrap selection with prefix and suffix
  const wrapSelection = useCallback((prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    form.setFieldValue('content', newText);
    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }, [form]);

  // Insert spaces for Tab key
  const insertSpaces = useCallback((count: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const spaces = ' '.repeat(count);

    const newText = text.substring(0, start) + spaces + text.substring(end);
    form.setFieldValue('content', newText);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + count, start + count);
    }, 0);
  }, [form]);

  // Toolbar button handlers
  const handleToolbarAction = useCallback((action: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart || 0;
    const end = textarea?.selectionEnd || 0;
    const text = form.getFieldValue('content') || '';
    const selectedText = text.substring(start, end);

    let newText = text;
    let cursorOffset = 0;

    switch (action) {
      case 'h2':
        newText = text.substring(0, start) + '\n## ' + (selectedText || '标题') + '\n' + text.substring(end);
        cursorOffset = 5;
        break;
      case 'h3':
        newText = text.substring(0, start) + '\n### ' + (selectedText || '标题') + '\n' + text.substring(end);
        cursorOffset = 6;
        break;
      case 'bold':
        newText = text.substring(0, start) + '**' + (selectedText || '粗体文本') + '**' + text.substring(end);
        cursorOffset = 2;
        break;
      case 'italic':
        newText = text.substring(0, start) + '*' + (selectedText || '斜体文本') + '*' + text.substring(end);
        cursorOffset = 1;
        break;
      case 'quote':
        newText = text.substring(0, start) + '\n> ' + (selectedText || '引用文本') + '\n' + text.substring(end);
        cursorOffset = 3;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          newText = text.substring(0, start) + '\n```\n' + (selectedText || '代码') + '\n```\n' + text.substring(end);
        } else {
          newText = text.substring(0, start) + '`' + (selectedText || 'code') + '`' + text.substring(end);
        }
        cursorOffset = 4;
        break;
      case 'link':
        newText = text.substring(0, start) + '[' + (selectedText || '链接文本') + '](url)' + text.substring(end);
        cursorOffset = selectedText.length + 3;
        break;
      case 'image':
        newText = text.substring(0, start) + '![' + (selectedText || '图片描述') + '](url)' + text.substring(end);
        cursorOffset = selectedText.length + 4;
        break;
      case 'ul':
        newText = text.substring(0, start) + '\n- ' + (selectedText || '列表项') + '\n' + text.substring(end);
        cursorOffset = 3;
        break;
      case 'ol':
        newText = text.substring(0, start) + '\n1. ' + (selectedText || '列表项') + '\n' + text.substring(end);
        cursorOffset = 4;
        break;
      case 'table':
        newText = text.substring(0, start) + '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n' + text.substring(end);
        cursorOffset = 32;
        break;
      case 'latex':
        newText = text.substring(0, start) + '\n$$\n' + (selectedText || '数学公式') + '\n$$\n' + text.substring(end);
        cursorOffset = 4;
        break;
      default:
        return;
    }

    form.setFieldValue('content', newText);
    setContent(newText);

    setTimeout(() => {
      textarea?.focus();
      const newPos = start + cursorOffset + (selectedText ? selectedText.length : 0);
      textarea?.setSelectionRange(newPos, newPos);
    }, 0);
  }, [form]);

  // Simple markdown to HTML converter for preview
  const renderMarkdownPreview = (text: string): string => {
    if (!text) return '';

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%" />')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');

    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

    return html;
  };

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
      setContent(data.content || '');
      setLastSaved(new Date(data.updatedAt));
      initialContentRef.current = data.content || '';
      setHasUnsavedChanges(false);
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
    } catch (error: unknown) {
      console.error('Load article error:', error);
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      message.error(`${t('errors.loadFailed')}: ${msg}`);
    }
  };

  const loadMedia = async () => {
    try {
      const data = await mediaApi.getAll(1, 50);
      setMedia(data.items);
    } catch {
      message.error(t('errors.loadFailed'));
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
        content: content,  // Use React state directly, not from form
        coverImageUrl: selectedCoverImage || undefined,
        isTop: values.isTop || false,
        isFeatured: values.isFeatured || false,
      };

      if (isEditing && article) {
        await articlesApi.update(article.id, request);
        setLastSaved(new Date());
        initialContentRef.current = content;
        setHasUnsavedChanges(false);
        message.success(t('article.saveSuccess'));
      } else {
        const slug = values.slug || generateSlug(values.title);
        const createRequest: CreateArticleRequest = {
          ...request,
          slug,
        };
        const newArticle = await articlesApi.create(createRequest);
        initialContentRef.current = content;
        setHasUnsavedChanges(false);
        message.success(t('article.saveSuccess'));
        navigate(`/articles/${newArticle.id}/edit`, { replace: true });
      }
    } catch (error: unknown) {
      console.error('Save article error:', error);
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      message.error(`${t('article.saveFailed')}: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!article) {
      await handleSave();
      return;
    }

    setPublishing(true);
    try {
      // Set article status to Publishing before starting
      await articlesApi.update(article.id, { status: ArticleStatus.Publishing });

      const job: PublishJob = await articlesApi.publish(article.id);
      message.info(t('article.publishing'));

      const pollJob = async () => {
        const updatedJob = await jobsApi.get(job.id);
        if (updatedJob.status === 'Succeeded') {
          // Update article status to Published and refresh
          await articlesApi.update(article.id, { status: ArticleStatus.Published });
          const publicUrl = updatedJob.publicUrl || `/posts/${form.getFieldValue('slug')}`;
          const fullUrl = `${window.location.origin}${publicUrl}`;
          message.success({
            content: (
              <span>
                {t('article.published')}
                <br />
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>Commit: {updatedJob.commitSha}</span>
                <br />
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                  {fullUrl}
                </a>
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(fullUrl);
                    message.success(t('article.slugCopied'));
                  }}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  复制链接
                </Button>
              </span>
            ),
            duration: 8,
          });
          loadArticle(article.id);
          setPublishing(false);
        } else if (updatedJob.status === 'Failed') {
          // Update article status to Failed
          await articlesApi.update(article.id, { status: ArticleStatus.Failed });
          message.error(`${t('article.publishFailed')}: ${updatedJob.errorMessage || 'Unknown error'}`);
          loadArticle(article.id);
          setPublishing(false);
        } else {
          setTimeout(pollJob, 2000);
        }
      };

      setTimeout(pollJob, 2000);
    } catch (error) {
      message.error(t('article.publishFailed'));
      setPublishing(false);
    }
  };

  const handleCopySlug = () => {
    const slug = form.getFieldValue('slug');
    if (slug) {
      navigator.clipboard.writeText(slug);
      message.success(t('article.slugCopied'));
    }
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

  const handleImportMd = async (file: File) => {
    try {
      const parsed = await importMdFile(file);
      form.setFieldsValue({
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        content: parsed.content,
        tag: parsed.tags.join(', '),
      });
      setContent(parsed.content);
      message.success(t('common.success'));
      setImportModalVisible(false);
    } catch (error) {
      console.error('Import error:', error);
      message.error(t('errors.importFailed'));
    }
    return false;
  };

  const handleImportWord = async (file: File) => {
    try {
      const parsed = await importWordFile(file);
      form.setFieldsValue({
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        content: parsed.content,
        tag: parsed.tags.join(', '),
      });
      setContent(parsed.content);
      message.success(t('common.success'));
      setImportModalVisible(false);
    } catch (error) {
      console.error('Import error:', error);
      message.error(t('errors.importFailed'));
    }
    return false;
  };

  const handleExport = async (format: 'md' | 'word' | 'latex') => {
    const values = form.getFieldsValue();
    const articleData = {
      title: values.title || 'Untitled',
      content: values.content || '',
      description: values.description,
      tags: values.tag,
    };

    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'md':
        blob = new Blob([exportAsMarkdown(articleData)], { type: 'text/markdown' });
        filename = `${articleData.title}.md`;
        break;
      case 'word':
        blob = await exportAsWord(articleData);
        filename = `${articleData.title}.docx`;
        break;
      case 'latex':
        blob = new Blob([exportAsLatex(articleData)], { type: 'text/plain' });
        filename = `${articleData.title}.tex`;
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(t('common.success'));
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'md',
      icon: <FileMarkdownOutlined />,
      label: t('article.exportMd'),
      onClick: () => handleExport('md'),
    },
    {
      key: 'word',
      icon: <FileWordOutlined />,
      label: t('article.exportWord'),
      onClick: () => handleExport('word'),
    },
    {
      key: 'latex',
      icon: <FileTextOutlined />,
      label: t('article.exportLatex'),
      onClick: () => handleExport('latex'),
    },
  ];

  // Calculate stats
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
  const codeBlockCount = (content.match(/```[\s\S]*?```/g) || []).length;

  // Get article status text
  const getStatusText = (status: ArticleStatus | undefined) => {
    switch (status) {
      case ArticleStatus.Draft:
        return t('article.status.draft');
      case ArticleStatus.Published:
        return t('article.status.published');
      case ArticleStatus.Archived:
        return t('article.status.archived');
      case ArticleStatus.Publishing:
        return t('article.status.publishing');
      case ArticleStatus.Failed:
        return t('article.status.failed');
      default:
        return t('article.status.draft');
    }
  };

  // Validation item type
  interface ValidationItem {
    level: 'error' | 'warning' | 'info';
    ok: boolean;
    text: string;
  }

  // Content validation with levels
  const getValidationItems = (): ValidationItem[] => {
    const values = form.getFieldsValue();
    const items: ValidationItem[] = [];

    // Title validation - ERROR level (blocks publish)
    if (values.title) {
      items.push({ level: 'info', ok: true, text: t('article.titleOk') });
    } else {
      items.push({ level: 'error', ok: false, text: t('article.titleRequired') });
    }

    // Slug validation - ERROR level (blocks publish)
    if (values.slug) {
      items.push({ level: 'info', ok: true, text: t('article.slugOk') });
    } else {
      items.push({ level: 'error', ok: false, text: t('article.slugRequired') });
    }

    // Description validation - WARNING level (allows publish with confirm)
    if (values.description && values.description.length >= 50) {
      items.push({ level: 'info', ok: true, text: t('article.descOk') });
    } else if (values.description) {
      items.push({ level: 'warning', ok: false, text: t('article.descShort') });
    } else {
      items.push({ level: 'warning', ok: false, text: t('article.descEmpty') });
    }

    // Content validation - ERROR level (blocks publish)
    if (content && content.length > 0) {
      items.push({ level: 'info', ok: true, text: t('article.contentOk') });
    } else {
      items.push({ level: 'error', ok: false, text: t('article.contentEmpty') });
    }

    // Tag validation - WARNING level (warning if empty)
    if (values.tag) {
      items.push({ level: 'info', ok: true, text: t('article.tagOk') });
    } else {
      items.push({ level: 'warning', ok: false, text: t('article.tagEmpty') });
    }

    return items;
  };

  // Check if validation has errors (blocks publish)
  const hasValidationErrors = (): boolean => {
    return getValidationItems().some(item => item.level === 'error' && !item.ok);
  };

  // Check if validation has warnings
  const hasValidationWarnings = (): boolean => {
    return getValidationItems().some(item => item.level === 'warning' && !item.ok);
  };

  // Get canonical URL
  const getCanonicalUrl = (): string => {
    const slug = form.getFieldValue('slug');
    if (slug) {
      return `${window.location.origin}/articles/${slug}`;
    }
    return '';
  };

  // Get validation icon by level
  const getValidationIcon = (item: ValidationItem) => {
    if (item.ok) {
      return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />;
    }
    switch (item.level) {
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 14 }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14', fontSize: 14 }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 14 }} />;
    }
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (saving) return t('article.saving');
    if (!lastSaved) return t('article.unsaved');
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    if (diff < 60000) return t('article.justNow');
    if (diff < 3600000) return `${Math.floor(diff / 60000)} ${t('article.minutesAgo')}`;
    return `${t('article.savedAt')} ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Format published time
  const formatPublishedAt = () => {
    if (!article?.publishedAt) return t('article.notPublished');
    const date = new Date(article.publishedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return t('article.justNow');
    if (diff < 3600000) return `${Math.floor(diff / 60000)} ${t('article.minutesAgo')}`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ${t('article.hoursAgo')}`;
    return date.toLocaleDateString();
  };

  // Handle preview - switch to preview mode in editor
  const handlePreview = () => {
    setEditorMode('preview');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    form.setFieldValue('content', newContent);
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    { key: 'h2', label: 'H2', tooltip: '标题 2', style: { fontWeight: 'bold' as const, fontSize: 14 } },
    { key: 'h3', label: 'H3', tooltip: '标题 3', style: { fontWeight: 'bold' as const, fontSize: 13 } },
    { key: 'bold', icon: <BoldOutlined />, tooltip: '加粗 (Ctrl+B)' },
    { key: 'italic', icon: <ItalicOutlined />, tooltip: '斜体 (Ctrl+I)' },
    { key: 'quote', icon: <InsertRowAboveOutlined />, tooltip: '引用' },
    { key: 'code', icon: <CodeOutlined />, tooltip: '代码块' },
    { key: 'link', icon: <LinkOutlined />, tooltip: '链接' },
    { key: 'image', icon: <PictureOutlined />, tooltip: '图片' },
    { key: 'ul', icon: <UnorderedListOutlined />, tooltip: '无序列表' },
    { key: 'ol', icon: <OrderedListOutlined />, tooltip: '有序列表' },
    { key: 'table', icon: <TableOutlined />, tooltip: '表格' },
    { key: 'latex', label: '∑', tooltip: '数学公式', style: { fontFamily: 'serif' as const, fontStyle: 'italic' as const } },
  ];

  const editorModeOptions = [
    { key: 'edit' as const, label: t('article.edit'), icon: <EditOutlined /> },
    { key: 'preview' as const, label: t('article.preview'), icon: <EyeOutlined /> },
    { key: 'split' as const, label: t('article.split'), icon: <ColumnWidthOutlined /> },
  ];

  return (
    <div>
      {/* Enhanced Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: '8px 16px',
        background: '#fafafa',
        borderRadius: 8,
        border: '1px solid #f0f0f0'
      }}>
        {/* Left: Return button and status */}
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              if (hasUnsavedChanges) {
                Modal.confirm({
                  title: t('article.unsavedWarning'),
                  okText: t('common.confirm'),
                  cancelText: t('common.cancel'),
                  onOk: () => navigate('/articles'),
                });
              } else {
                navigate('/articles');
              }
            }}
          >
            {t('common.back')}
          </Button>
          <Text type="secondary">
            {isEditing ? t('article.editArticle') : t('article.newArticle')} · {getStatusText(article?.status)}
          </Text>
        </Space>

        {/* Center: Save status */}
        <Space>
          {saving ? (
            <Text type="secondary">{t('article.saving')}</Text>
          ) : hasUnsavedChanges ? (
            <Text type="warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <SaveFilled style={{ fontSize: 12 }} /> {t('article.unsaved')}
            </Text>
          ) : (
            <Text type="secondary">{formatLastSaved()}</Text>
          )}
        </Space>

        {/* Right: Actions */}
        <Space>
          <Button.Group>
            {editorModeOptions.map(opt => (
              <Tooltip key={opt.key} title={opt.label}>
                <Button
                  type={editorMode === opt.key ? 'primary' : 'default'}
                  icon={opt.icon}
                  onClick={() => setEditorMode(opt.key)}
                />
              </Tooltip>
            ))}
          </Button.Group>
          <Dropdown menu={{ items: exportMenuItems }}>
            <Button icon={<DownloadOutlined />}>
              {t('common.export')}
            </Button>
          </Dropdown>
          <Button icon={<UploadOutlined />} onClick={() => setImportModalVisible(true)}>
            {t('common.import')}
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
          >
            {t('article.saveDraft')}
          </Button>
        </Space>
      </div>

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
                label={t('article.articleTitle')}
                rules={[{ required: true, message: `${t('common.title')} is required` }]}
              >
                <Input placeholder={t('article.articleTitle')} size="large" />
              </Form.Item>

              <Form.Item
                name="slug"
                label={t('article.slug')}
                rules={[{ required: true, message: `${t('article.slug')} is required` }]}
              >
                <Input
                  placeholder="article-slug"
                  suffix={
                    <Tooltip title={t('article.copySlug')}>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={handleCopySlug}
                        size="small"
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>

              <Form.Item name="description" label={t('common.description')}>
                <TextArea
                  rows={2}
                  placeholder={t('common.description')}
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Card>

            {/* Content Editor Card */}
            <Card
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 0 }}
              title={
                <Space>
                  <Text strong>{t('article.content')}</Text>
                </Space>
              }
              extra={
                <Tooltip title={t('article.insertImage')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<PictureOutlined />}
                    onClick={() => {
                      loadMedia();
                      setMediaModalVisible(true);
                    }}
                  />
                </Tooltip>
              }
            >
              {/* Markdown Toolbar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: '8px 12px',
                borderBottom: '1px solid #f0f0f0',
                flexWrap: 'wrap'
              }}>
                {toolbarButtons.map((btn) => (
                  <Tooltip key={btn.key} title={btn.tooltip}>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleToolbarAction(btn.key)}
                      style={btn.style}
                    >
                      {btn.icon || btn.label}
                    </Button>
                  </Tooltip>
                ))}
              </div>

              {/* Editor Area */}
              {editorMode === 'edit' && (
                <TextArea
                  ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                  rows={20}
                  placeholder={t('article.writeContent')}
                  style={{
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    border: 'none',
                    borderRadius: 0
                  }}
                  value={content}
                  onChange={handleContentChange}
                />
              )}

              {editorMode === 'preview' && (
                <div
                  style={{
                    minHeight: 400,
                    padding: '16px 20px',
                    overflow: 'auto',
                    background: '#fff'
                  }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                />
              )}

              {editorMode === 'split' && (
                <Row gutter={0}>
                  <Col span={12} style={{ borderRight: '1px solid #f0f0f0' }}>
                    <TextArea
                      ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                      rows={20}
                      placeholder={t('article.writeContent')}
                      style={{
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                        border: 'none',
                        borderRadius: 0,
                        resize: 'none'
                      }}
                      value={content}
                      onChange={handleContentChange}
                      onScroll={handleEditorScroll}
                    />
                  </Col>
                  <Col span={12}>
                    <div
                      ref={previewRef}
                      style={{
                        minHeight: 400,
                        padding: '16px 20px',
                        overflow: 'auto',
                        background: '#fff'
                      }}
                      dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                      onScroll={handlePreviewScroll}
                    />
                  </Col>
                </Row>
              )}

              {/* Bottom Status Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '8px 16px',
                borderTop: '1px solid #f0f0f0',
                background: '#fafafa'
              }}>
                <Text type="secondary">
                  {t('article.words')}：{wordCount}
                </Text>
                <Text type="secondary">
                  {t('article.characters')}：{charCount}
                </Text>
                <Text type="secondary">
                  {t('article.headings')}：{headingCount}
                </Text>
                <Text type="secondary">
                  {t('article.codeBlocks')}：{codeBlockCount}
                </Text>
                <Text type="secondary">
                  {t('article.readTime')}：{readTimeMinutes} {t('article.minutes')}
                </Text>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Collapse defaultActiveKey={['publish', 'settings', 'validation']} ghost>
              {/* Publish Section */}
              <Collapse.Panel
                key="publish"
                header={
                  <Space>
                    <CloudUploadOutlined />
                    <span>{t('article.publishPanel')}</span>
                  </Space>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  {/* Status */}
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('article.status')}: </Text>
                    <Text strong>{getStatusText(article?.status)}</Text>
                  </div>

                  {/* Last Saved */}
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FieldTimeOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('article.lastSaved')}: </Text>
                    <Text style={{ fontSize: 12 }}>
                      {hasUnsavedChanges ? (
                        <Text type="warning">{t('article.unsaved')}</Text>
                      ) : (
                        formatLastSaved()
                      )}
                    </Text>
                  </div>

                  {/* Last Published */}
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LinkOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('article.lastPublished')}: </Text>
                    <Text style={{ fontSize: 12 }}>{formatPublishedAt()}</Text>
                  </div>

                  {/* Publish Error Alert */}
                  {article?.status === ArticleStatus.Failed && (
                    <Alert
                      type="error"
                      message={t('article.publishFailed')}
                      showIcon
                      style={{ marginBottom: 12 }}
                    />
                  )}

                  {/* Action Buttons */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                      loading={saving}
                      block
                    >
                      {t('article.saveDraft')}
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={handlePreview}
                      block
                    >
                      {t('article.preview')}
                    </Button>
                    {hasValidationErrors() ? (
                      <Tooltip title={t('article.validationFailed')}>
                        <Button
                          icon={<CloudUploadOutlined />}
                          disabled
                          block
                        >
                          {article?.status === ArticleStatus.Published ? t('article.republish') : t('article.publish')}
                        </Button>
                      </Tooltip>
                    ) : hasValidationWarnings() ? (
                      <Popconfirm
                        title={t('article.publishWarningTitle')}
                        description={t('article.publishWarningDesc')}
                        onConfirm={handlePublish}
                        okText={t('common.confirm')}
                        cancelText={t('common.cancel')}
                      >
                        <Button
                          type="primary"
                          danger={article?.status === ArticleStatus.Published}
                          icon={<CloudUploadOutlined />}
                          loading={publishing}
                          block
                        >
                          {article?.status === ArticleStatus.Published ? t('article.republish') : t('article.publish')}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Button
                        type="primary"
                        danger={article?.status === ArticleStatus.Published}
                        icon={<CloudUploadOutlined />}
                        onClick={handlePublish}
                        loading={publishing}
                        block
                      >
                        {article?.status === ArticleStatus.Published ? t('article.republish') : t('article.publish')}
                      </Button>
                    )}
                  </Space>
                </div>
              </Collapse.Panel>

              {/* Content Settings Section */}
              <Collapse.Panel
                key="settings"
                header={
                  <Space>
                    <SettingOutlined />
                    <span>{t('article.contentSettings')}</span>
                  </Space>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  <Form.Item name="tag" label={t('article.tag')} style={{ marginBottom: 12 }}>
                    <AutoComplete
                      options={tagOptions}
                      placeholder={t('article.tag')}
                      value={form.getFieldValue('tag')}
                      onSelect={(value) => form.setFieldValue('tag', value)}
                      onChange={(value) => form.setFieldValue('tag', value)}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <Form.Item name="coverImage" label={t('article.coverImage')} style={{ marginBottom: 12 }}>
                    <div>
                      {selectedCoverImage ? (
                        <div style={{ marginBottom: 8 }}>
                          <Image
                            src={selectedCoverImage}
                            alt="Cover"
                            style={{ width: '100%', maxHeight: 100, objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: 60,
                            background: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 8,
                            borderRadius: 4,
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 12 }}>{t('article.noCover')}</Text>
                        </div>
                      )}
                      <Button
                        icon={<PictureOutlined />}
                        onClick={() => {
                          loadMedia();
                          setCoverImageModalVisible(true);
                        }}
                        block
                        size="small"
                      >
                        {selectedCoverImage ? t('article.changeCover') : t('article.selectCover')}
                      </Button>
                    </div>
                  </Form.Item>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                    <Form.Item name="isTop" label={t('article.pinToTop')} valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch size="small" />
                    </Form.Item>
                    <Form.Item name="isFeatured" label={t('article.featured')} valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch size="small" />
                    </Form.Item>
                  </div>

                  {/* Stats */}
                  <div style={{ padding: '8px', background: '#fafafa', borderRadius: 6, marginTop: 8 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{t('article.readTime')}:</Text>
                        <Text style={{ fontSize: 12 }}>{readTimeMinutes} {t('article.minutes')}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{t('article.wordCount')}:</Text>
                        <Text style={{ fontSize: 12 }}>{wordCount}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{t('article.charCount')}:</Text>
                        <Text style={{ fontSize: 12 }}>{charCount}</Text>
                      </div>
                    </Space>
                  </div>
                </div>
              </Collapse.Panel>

              {/* SEO Section */}
              <Collapse.Panel
                key="seo"
                header={
                  <Space>
                    <LinkOutlined />
                    <span>{t('article.seoPanel')}</span>
                  </Space>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  <Form.Item name="seoTitle" label={t('article.seoTitle')} style={{ marginBottom: 12 }}>
                    <Input
                      placeholder={form.getFieldValue('title') || t('article.seoTitlePlaceholder')}
                      size="small"
                    />
                  </Form.Item>
                  <Form.Item name="seoDescription" label={t('article.seoDescription')} style={{ marginBottom: 8 }}>
                    <Input.TextArea
                      rows={2}
                      placeholder={t('article.seoDescPlaceholder')}
                      maxLength={160}
                      showCount
                      size="small"
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('article.canonicalUrl')}:</Text>
                    <div style={{ wordBreak: 'break-all' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{getCanonicalUrl() || '-'}</Text>
                    </div>
                  </div>
                </div>
              </Collapse.Panel>

              {/* Validation Section */}
              <Collapse.Panel
                key="validation"
                header={
                  <Space>
                    <CheckCircleOutlined />
                    <span>{t('article.validationPanel')}</span>
                    {hasValidationErrors() && (
                      <Badge count={getValidationItems().filter(i => i.level === 'error' && !i.ok).length} style={{ backgroundColor: '#ff4d4f' }} />
                    )}
                  </Space>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  {getValidationItems().map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      {getValidationIcon(item)}
                      <Text
                        style={{
                          fontSize: 12,
                          color: item.level === 'error' ? '#ff4d4f' : item.level === 'warning' ? '#faad14' : '#52c41a',
                        }}
                      >
                        {item.text}
                      </Text>
                    </div>
                  ))}
                </div>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Form>

      {/* Import Modal */}
      <Modal
        title={t('article.importDocument')}
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Dragger
            accept=".md,.mdx"
            showUploadList={false}
            beforeUpload={handleImportMd}
          >
            <p className="ant-upload-drag-icon">
              <FileMarkdownOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">{t('article.importMd')}</p>
            <p className="ant-upload-hint">Click or drag MD/MDX files to import</p>
          </Dragger>
          <Dragger
            accept=".docx"
            showUploadList={false}
            beforeUpload={handleImportWord}
          >
            <p className="ant-upload-drag-icon">
              <FileWordOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">{t('article.importWord')}</p>
            <p className="ant-upload-hint">Click or drag Word documents to import</p>
          </Dragger>
        </Space>
      </Modal>

      {/* Media Selection Modal for Insert Image */}
      <Modal
        title={t('article.insertImage')}
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
        title={t('article.selectCover')}
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
