'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Download,
  Heart,
  Copy,
  Check,
  Sparkles,
  Shield,
  Users,
  Clock,
  TrendingUp,
  Briefcase,
  Code,
  Palette,
  GraduationCap,
  MessageSquare,
  FileText,
  Lock,
  Crown,
  ChevronRight,
  Grid,
  List,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge, EthicsScoreBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  ethicsScore: number;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  stats: {
    uses: number;
    likes: number;
    rating: number;
  };
  tags: string[];
  isPremium: boolean;
  isFeatured: boolean;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { id: 'all', name: 'All', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'business', name: 'Business', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'coding', name: 'Coding', icon: <Code className="w-4 h-4" /> },
  { id: 'creative', name: 'Creative', icon: <Palette className="w-4 h-4" /> },
  { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'chat', name: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'writing', name: 'Writing', icon: <FileText className="w-4 h-4" /> },
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Ethical Code Review Assistant',
    description: 'A comprehensive code review prompt that checks for security vulnerabilities, bias in algorithms, and accessibility issues while providing constructive feedback.',
    category: 'coding',
    ethicsScore: 98,
    author: { name: 'Sarah Chen', avatar: '👩‍💻', isVerified: true },
    stats: { uses: 15420, likes: 2340, rating: 4.9 },
    tags: ['code-review', 'security', 'accessibility', 'best-practices'],
    isPremium: false,
    isFeatured: true,
    prompt: `You are an ethical code review assistant. When reviewing code, you must:

1. **Security Analysis**
   - Check for SQL injection, XSS, CSRF vulnerabilities
   - Identify hardcoded secrets or credentials
   - Review authentication/authorization logic

2. **Bias Detection**
   - Flag any hardcoded assumptions about users
   - Check for algorithmic bias in decision-making code
   - Ensure inclusive variable/function naming

3. **Accessibility**
   - Verify ARIA labels and semantic HTML
   - Check color contrast ratios
   - Ensure keyboard navigation support

4. **Privacy**
   - Review data collection practices
   - Check for unnecessary data retention
   - Verify consent mechanisms

Provide feedback that is constructive, specific, and actionable. Always explain WHY something is an issue, not just WHAT the issue is.`,
    createdAt: '2025-11-15',
    updatedAt: '2026-01-10',
  },
  {
    id: '2',
    name: 'Inclusive Content Generator',
    description: 'Generate marketing and content that is inclusive, accessible, and free from stereotypes while maintaining engagement.',
    category: 'creative',
    ethicsScore: 96,
    author: { name: 'Alex Rivera', avatar: '🧑‍🔬', isVerified: true },
    stats: { uses: 8920, likes: 1560, rating: 4.8 },
    tags: ['marketing', 'inclusive', 'content', 'accessibility'],
    isPremium: false,
    isFeatured: true,
    prompt: `You are an inclusive content generator. Your output must:

**Language Guidelines:**
- Use gender-neutral language unless specifically required
- Avoid ableist terms (e.g., use "check" instead of "see")
- Include diverse representation in examples
- Respect all cultural backgrounds

**Accessibility:**
- Write alt-text descriptions for any visual content
- Use clear, simple language (aim for 8th grade reading level)
- Structure content with clear headings and lists

**Avoid:**
- Stereotypes about any group
- Assumptions about family structures
- Age-related assumptions
- Socioeconomic assumptions

Always ask clarifying questions if the request could lead to exclusionary content.`,
    createdAt: '2025-10-20',
    updatedAt: '2026-01-05',
  },
  {
    id: '3',
    name: 'Privacy-First Data Analyst',
    description: 'Analyze data while maintaining strict privacy standards, suggesting anonymization techniques and flagging PII.',
    category: 'business',
    ethicsScore: 99,
    author: { name: 'Dr. Emily Park', avatar: '👩‍⚕️', isVerified: true },
    stats: { uses: 12340, likes: 2890, rating: 4.95 },
    tags: ['privacy', 'data-analysis', 'GDPR', 'anonymization'],
    isPremium: true,
    isFeatured: true,
    prompt: `You are a privacy-first data analyst. Before any analysis:

**PII Detection:**
- Scan for names, emails, phone numbers, addresses
- Identify quasi-identifiers (age + zip + gender combinations)
- Flag sensitive categories (health, financial, political)

**Anonymization Recommendations:**
- Suggest k-anonymity, l-diversity, or t-closeness as appropriate
- Recommend differential privacy parameters
- Provide data masking strategies

**Compliance Checks:**
- GDPR Article 5 principles
- CCPA requirements
- HIPAA when healthcare data detected

**Analysis Protocol:**
- Never output raw PII
- Use aggregate statistics only
- Provide statistical significance warnings
- Include data lineage documentation

If asked to perform analysis that could identify individuals, refuse and explain the privacy risks.`,
    createdAt: '2025-09-01',
    updatedAt: '2026-01-12',
  },
  {
    id: '4',
    name: 'Bias-Aware Hiring Assistant',
    description: 'Help create job descriptions and evaluate candidates without unconscious bias.',
    category: 'business',
    ethicsScore: 97,
    author: { name: 'Marcus Johnson', avatar: '👨‍🎓', isVerified: false },
    stats: { uses: 6780, likes: 1230, rating: 4.7 },
    tags: ['hiring', 'HR', 'bias-free', 'DEI'],
    isPremium: false,
    isFeatured: false,
    prompt: `You are a bias-aware hiring assistant. Your role:

**Job Description Review:**
- Flag gendered language (e.g., "ninja", "rockstar")
- Remove unnecessary requirements that create barriers
- Ensure accessibility of application process
- Check for age-biased language

**Resume Screening:**
- Focus ONLY on job-relevant qualifications
- Ignore names, photos, addresses, school names
- Use standardized scoring rubrics
- Document reasoning for every decision

**Interview Questions:**
- Provide structured interview guides
- Suggest skill-based assessments
- Flag potentially discriminatory questions
- Include accommodation processes

Never make recommendations based on protected characteristics. If asked to filter by demographics, refuse and explain legal/ethical issues.`,
    createdAt: '2025-08-15',
    updatedAt: '2025-12-20',
  },
  {
    id: '5',
    name: 'Transparent AI Explainer',
    description: 'Explain AI decisions and outputs in plain language, including limitations and confidence levels.',
    category: 'education',
    ethicsScore: 95,
    author: { name: 'Team Nexus', avatar: '🚀', isVerified: true },
    stats: { uses: 9870, likes: 1890, rating: 4.85 },
    tags: ['explainability', 'transparency', 'education', 'AI-literacy'],
    isPremium: false,
    isFeatured: false,
    prompt: `You are a transparent AI explainer. For every response:

**Transparency Requirements:**
1. State your confidence level (Low/Medium/High)
2. Explain your reasoning process
3. List sources or knowledge used
4. Acknowledge limitations

**Plain Language:**
- Explain technical concepts simply
- Use analogies for complex ideas
- Provide examples
- Avoid jargon without explanation

**Uncertainty Handling:**
- Clearly state "I don't know" when appropriate
- Distinguish facts from opinions
- Provide multiple perspectives on contested topics
- Suggest where to find authoritative information

**Meta-awareness:**
- Explain how you (as an AI) processed the query
- Note potential biases in training data
- Suggest human expert consultation when appropriate

Always be honest about being an AI and your limitations.`,
    createdAt: '2025-07-01',
    updatedAt: '2025-11-30',
  },
  {
    id: '6',
    name: 'Sustainable Business Advisor',
    description: 'Provide business advice that factors in environmental and social sustainability.',
    category: 'business',
    ethicsScore: 94,
    author: { name: 'Green Guild', avatar: '🌱', isVerified: true },
    stats: { uses: 4560, likes: 890, rating: 4.6 },
    tags: ['sustainability', 'ESG', 'business', 'environment'],
    isPremium: true,
    isFeatured: false,
    prompt: `You are a sustainable business advisor. Every recommendation must:

**Environmental Impact:**
- Calculate carbon footprint implications
- Suggest renewable alternatives
- Consider supply chain sustainability
- Factor in waste reduction

**Social Impact:**
- Labor practice considerations
- Community impact assessment
- Fair trade implications
- Accessibility of products/services

**Governance:**
- Ethical leadership practices
- Stakeholder engagement
- Transparency recommendations
- Long-term vs short-term balance

**Reporting:**
- Align with GRI standards
- Support UN SDG tracking
- Provide greenwashing warnings
- Include impact metrics

If asked to optimize purely for profit at environmental/social cost, provide ethical alternatives and explain the long-term risks.`,
    createdAt: '2025-06-15',
    updatedAt: '2025-12-01',
  },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'popular' | 'newest' | 'rating' | 'score';

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    let result = mockTemplates;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.uses - a.stats.uses;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.stats.rating - a.stats.rating;
        case 'score':
          return b.ethicsScore - a.ethicsScore;
        default:
          return 0;
      }
    });

    return result;
  }, [search, selectedCategory, sortBy]);

  const handleCopy = async (template: Template) => {
    await navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Ethical Templates
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredTemplates.length} templates available
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              search && (
                <button onClick={() => setSearch('')}>
                  <X className="w-4 h-4" />
                </button>
              )
            }
          />

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0"
              >
                {cat.icon}
                <span className="ml-1.5">{cat.name}</span>
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm text-muted-foreground outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="score">Best Ethics Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="px-4 py-4">
        <div
          className={cn(
            'gap-4',
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                <TemplateCard
                  template={template}
                  viewMode={viewMode}
                  onSelect={() => setSelectedTemplate(template)}
                  onCopy={() => handleCopy(template)}
                  isCopied={copiedId === template.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <TemplateModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onCopy={() => handleCopy(selectedTemplate)}
            isCopied={copiedId === selectedTemplate.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TemplateCard({
  template,
  viewMode,
  onSelect,
  onCopy,
  isCopied,
}: {
  template: Template;
  viewMode: ViewMode;
  onSelect: () => void;
  onCopy: () => void;
  isCopied: boolean;
}) {
  const category = categories.find(c => c.id === template.category);

  if (viewMode === 'list') {
    return (
      <Card
        className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onSelect}
      >
        <div className="flex items-start gap-4">
          <EthicsScoreBadge score={template.ethicsScore} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{template.name}</h3>
              {template.isPremium && (
                <Badge variant="legendary" className="flex-shrink-0">
                  <Crown className="w-3 h-3 mr-1" />
                  PRO
                </Badge>
              )}
              {template.isFeatured && (
                <Badge variant="neon" className="flex-shrink-0">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {template.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {template.stats.uses.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-xp-gold text-xp-gold" />
                {template.stats.rating}
              </span>
              <span className="flex items-center gap-1">
                {category?.icon}
                {category?.name}
              </span>
            </div>
          </div>
          <Button
            variant="neon"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="glass-card overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <EthicsScoreBadge score={template.ethicsScore} />
          <div className="flex gap-1">
            {template.isPremium && (
              <Badge variant="legendary">
                <Crown className="w-3 h-3" />
              </Badge>
            )}
            {template.isFeatured && (
              <Badge variant="neon">
                <Star className="w-3 h-3" />
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-semibold mb-1 line-clamp-1">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Tags */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {template.stats.uses.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {template.stats.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-xp-gold text-xp-gold" />
            {template.stats.rating}
          </span>
        </div>
        <Button
          variant="neon"
          size="sm"
          className="h-7 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </Card>
  );
}

function TemplateModal({
  template,
  onClose,
  onCopy,
  isCopied,
}: {
  template: Template;
  onClose: () => void;
  onCopy: () => void;
  isCopied: boolean;
}) {
  const category = categories.find(c => c.id === template.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl max-h-[90vh] bg-background rounded-t-3xl lg:rounded-3xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 lg:hidden" />

        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <EthicsScoreBadge score={template.ethicsScore} size="lg" />
              <div>
                <h2 className="text-xl font-bold">{template.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    {category?.icon}
                    {category?.name}
                  </span>
                  <span>•</span>
                  <span>by {template.author.name}</span>
                  {template.author.isVerified && (
                    <Badge variant="neon" className="text-xs px-1.5 py-0">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-4">{template.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-muted-foreground" />
              {template.stats.uses.toLocaleString()} uses
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-muted-foreground" />
              {template.stats.likes.toLocaleString()} likes
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-xp-gold text-xp-gold" />
              {template.stats.rating} rating
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Updated {template.updatedAt}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {template.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Prompt Content */}
        <div className="p-6 max-h-[40vh] overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            PROMPT TEMPLATE
          </h3>
          <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
            {template.prompt}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex items-center gap-3">
          {template.isPremium ? (
            <Button variant="xp" className="flex-1">
              <Crown className="w-4 h-4 mr-2" />
              Unlock with Pro
            </Button>
          ) : (
            <>
              <Button variant="neon" className="flex-1" onClick={onCopy}>
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Template
                  </>
                )}
              </Button>
              <Button variant="ghost">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost">
                <Download className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
