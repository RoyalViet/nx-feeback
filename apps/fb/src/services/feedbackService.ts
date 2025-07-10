import {
  ApiResponse,
  Feedback,
  FeedbackFilters,
  FeedbackResponse,
  FeedbackSubmission,
} from '@/models/stores/feedback.model';

class FeedbackStorage {
  private feedback: Feedback[] = [];
  private idCounter = 1;

  // Simulate API delay for realistic UX
  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async submitFeedback(submission: FeedbackSubmission): Promise<ApiResponse<Feedback>> {
    await this.delay();

    try {
      const newFeedback: Feedback = {
        id: `fb-${this.idCounter++}`,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        submittedAt: new Date(),
        isAnonymous: submission.name.toLowerCase() === 'anonymous',
        status: 'pending',
        priority: 'medium',
        category: 'General',
        tags: [],
        upvotes: 0,
        downvotes: 0,
      };

      this.feedback.unshift(newFeedback); // Add to beginning for newest first

      return {
        data: newFeedback,
        success: true,
        message: 'Feedback submitted successfully',
      };
    } catch (error) {
      return {
        data: {} as Feedback,
        success: false,
        message: 'Failed to submit feedback',
      };
    }
  }

  async getFeedback(
    page = 1,
    pageSize = 10,
    filters?: FeedbackFilters
  ): Promise<ApiResponse<FeedbackResponse>> {
    await this.delay(200);

    try {
      let filteredFeedback = [...this.feedback];

      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredFeedback = filteredFeedback.filter(
          fb =>
            fb.name.toLowerCase().includes(searchTerm) ||
            fb.message.toLowerCase().includes(searchTerm) ||
            fb.email.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (filters?.sortBy === 'oldest') {
        filteredFeedback.sort(
          (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        );
      } else {
        // Default: newest first
        filteredFeedback.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      }

      // Apply date range filter
      if (filters?.dateRange) {
        filteredFeedback = filteredFeedback.filter(fb => {
          const date = new Date(fb.submittedAt);
          return date >= filters.dateRange!.from && date <= filters.dateRange!.to;
        });
      }

      // Calculate pagination
      const total = filteredFeedback.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;
      const paginatedFeedback = filteredFeedback.slice(start, start + pageSize);

      return {
        data: {
          feedback: paginatedFeedback,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
        },
        success: true,
      };
    } catch (error) {
      return {
        data: {
          feedback: [],
          pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
        },
        success: false,
        message: 'Failed to fetch feedback',
      };
    }
  }

  // Utility method to get feedback count (useful for analytics)
  async getFeedbackCount(): Promise<number> {
    return this.feedback.length;
  }

  // Method to seed with sample data for demo
  seedSampleData() {
    const categories = [
      'Bug Report',
      'Feature Request',
      'UI/UX',
      'Performance',
      'Documentation',
      'Security',
      'Integration',
      'Mobile',
      'API',
      'General',
    ];
    const tags = [
      'urgent',
      'enhancement',
      'bug',
      'question',
      'documentation',
      'mobile',
      'desktop',
      'api',
      'security',
      'performance',
      'ui',
      'ux',
    ];
    const sentiments = ['positive', 'negative', 'neutral'] as const;
    const priorities = ['low', 'medium', 'high', 'urgent'] as const;
    const statuses = ['pending', 'replied', 'draft'] as const;

    const sampleMessages = [
      'The new dashboard is fantastic! Much easier to navigate and find what I need. Great work on the UX improvements.',
      'Loading times could be faster, especially on mobile devices. Otherwise, the app works well.',
      'Love the new features! The search functionality is particularly useful. Looking forward to future updates.',
      'The interface is clean and intuitive. However, it would be great to have dark mode support for better accessibility.',
      'Great job on the mobile responsiveness! The app works perfectly on my phone. Could use more customization options though.',
      'The color scheme is beautiful and the typography is very readable. This is exactly what modern apps should look like.',
      'Performance has improved significantly since the last update. Login process is much smoother now.',
      'The notification system works great! I never miss important updates anymore. Very satisfied with the user experience.',
      'Bug report: The search feature sometimes returns duplicate results. Other than that, everything works perfectly.',
      'Integration with third-party tools is seamless. This has saved our team hours of manual work every week.',
      'The export functionality is exactly what we needed. Data visualization features are also very helpful for our reports.',
      'Customer support has been excellent. Quick responses and helpful solutions. The documentation is also comprehensive.',
      'The collaboration features make teamwork so much easier. Real-time updates and shared workspaces are game changers.',
      'Security features give me confidence in using this for sensitive client data. Two-factor authentication works flawlessly.',
      'The accessibility features are outstanding. This is one of the most inclusive apps I have used. Great job on WCAG compliance.',
      'API documentation is clear and well-structured. Integration was straightforward and the endpoints are very reliable.',
      'The mobile app crashes frequently when uploading large files. This needs to be fixed urgently.',
      'Feature request: Please add keyboard shortcuts for power users. This would significantly improve productivity.',
      'The recent update broke the export feature. CSV files are now corrupted and unusable.',
      'Suggestion: Add a bulk actions feature to handle multiple items at once. This would save a lot of time.',
    ];

    for (let i = 0; i < 5000; i++) {
      const randomDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const isAnonymous = Math.random() > 0.8;
      const hasReply = Math.random() > 0.6;
      const isRead = Math.random() > 0.3;

      const feedback: Omit<Feedback, 'id'> = {
        name: isAnonymous ? 'Anonymous' : `User ${i + 1}`,
        email: isAnonymous ? 'anonymous@example.com' : `user${i + 1}@example.com`,
        message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        submittedAt: randomDate,
        isAnonymous,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1),
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        readAt: isRead
          ? new Date(randomDate.getTime() + Math.random() * 24 * 60 * 60 * 1000)
          : undefined,
        upvotes: Math.floor(Math.random() * 50),
        downvotes: Math.floor(Math.random() * 10),
        reply: hasReply
          ? {
              message:
                'Thank you for your feedback! We have reviewed your submission and will take appropriate action.',
              repliedAt: new Date(randomDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
              repliedBy: 'Support Team',
              status: Math.random() > 0.3 ? 'published' : 'draft',
            }
          : undefined,
      };

      const newFeedback: Feedback = {
        ...feedback,
        id: `fb-${this.idCounter++}`,
      };
      this.feedback.push(newFeedback);
    }

    const sampleFeedback: Omit<Feedback, 'id'>[] = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        message:
          'The new dashboard is fantastic! Much easier to navigate and find what I need. Great work on the UX improvements.',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'high',
        category: 'UI/UX',
        tags: ['enhancement'],
        upvotes: 15,
        downvotes: 1,
        sentiment: 'positive',
      },
      {
        name: 'Anonymous',
        email: 'user@example.com',
        message:
          'Loading times could be faster, especially on mobile devices. Otherwise, the app works well.',
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isAnonymous: true,
        status: 'pending',
        priority: 'medium',
        category: 'Performance',
        tags: ['performance', 'mobile'],
        upvotes: 3,
        downvotes: 0,
        sentiment: 'neutral',
      },
      {
        name: 'Michael Chen',
        email: 'mike.chen@company.com',
        message:
          'Love the new features! The search functionality is particularly useful. Looking forward to future updates.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        category: 'Feature Request',
        tags: ['enhancement', 'search'],
        upvotes: 8,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Emma Rodriguez',
        email: 'emma.r@startup.io',
        message:
          'The interface is clean and intuitive. However, it would be great to have dark mode support for better accessibility.',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'low',
        category: 'UI/UX',
        tags: ['ui', 'accessibility'],
        upvotes: 5,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'David Kim',
        email: 'david.kim@tech.co',
        message:
          'Great job on the mobile responsiveness! The app works perfectly on my phone. Could use more customization options though.',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        category: 'Mobile',
        tags: ['mobile', 'enhancement'],
        upvotes: 12,
        downvotes: 1,
        sentiment: 'positive',
      },
      {
        name: 'Lisa Wang',
        email: 'lisa.w@design.studio',
        message:
          'The color scheme is beautiful and the typography is very readable. This is exactly what modern apps should look like.',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'low',
        category: 'UI/UX',
        tags: ['ui', 'design'],
        upvotes: 18,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Robert Brown',
        email: 'rob.brown@corp.com',
        message:
          'Performance has improved significantly since the last update. Login process is much smoother now.',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'medium',
        category: 'Performance',
        tags: ['performance'],
        upvotes: 7,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Anna Garcia',
        email: 'anna.garcia@startup.com',
        message:
          'The notification system works great! I never miss important updates anymore. Very satisfied with the user experience.',
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'low',
        category: 'General',
        tags: ['notification', 'ux'],
        upvotes: 9,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Anonymous',
        email: 'feedback@user.com',
        message:
          'Bug report: The search feature sometimes returns duplicate results. Other than that, everything works perfectly.',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isAnonymous: true,
        status: 'pending',
        priority: 'medium',
        category: 'Bug Report',
        tags: ['bug', 'search'],
        upvotes: 4,
        downvotes: 1,
        sentiment: 'neutral',
      },
      {
        name: 'James Wilson',
        email: 'james.w@enterprise.org',
        message:
          'Integration with third-party tools is seamless. This has saved our team hours of manual work every week.',
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'medium',
        category: 'Integration',
        tags: ['integration'],
        upvotes: 22,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Maria Silva',
        email: 'maria.silva@business.net',
        message:
          'The export functionality is exactly what we needed. Data visualization features are also very helpful for our reports.',
        submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'low',
        category: 'Feature Request',
        tags: ['export', 'data'],
        upvotes: 14,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Kevin Lee',
        email: 'kevin.lee@agency.io',
        message:
          'Customer support has been excellent. Quick responses and helpful solutions. The documentation is also comprehensive.',
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'low',
        category: 'General',
        tags: ['support', 'documentation'],
        upvotes: 11,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Sophie Turner',
        email: 'sophie.turner@creative.com',
        message:
          'The collaboration features make teamwork so much easier. Real-time updates and shared workspaces are game changers.',
        submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        category: 'Feature Request',
        tags: ['collaboration'],
        upvotes: 16,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Alex Thompson',
        email: 'alex.t@consultancy.biz',
        message:
          'Security features give me confidence in using this for sensitive client data. Two-factor authentication works flawlessly.',
        submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'high',
        category: 'Security',
        tags: ['security'],
        upvotes: 19,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Rachel Green',
        email: 'rachel.g@nonprofit.org',
        message:
          'The accessibility features are outstanding. This is one of the most inclusive apps I have used. Great job on WCAG compliance.',
        submittedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        category: 'Accessibility',
        tags: ['accessibility'],
        upvotes: 25,
        downvotes: 0,
        sentiment: 'positive',
      },
      {
        name: 'Daniel Park',
        email: 'daniel.park@tech.inc',
        message:
          'API documentation is clear and well-structured. Integration was straightforward and the endpoints are very reliable.',
        submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'replied',
        priority: 'low',
        category: 'API',
        tags: ['api', 'documentation'],
        upvotes: 13,
        downvotes: 0,
        sentiment: 'positive',
      },
    ];

    sampleFeedback.forEach(fb => {
      const newFeedback: Feedback = {
        ...fb,
        id: `fb-${this.idCounter++}`,
      };
      this.feedback.push(newFeedback);
    });
  }
}

// Singleton instance for consistent data across the app
const feedbackStorage = new FeedbackStorage();

// Seed sample data for demo
feedbackStorage.seedSampleData();

// Export service methods
export const feedbackService = {
  submitFeedback: (submission: FeedbackSubmission) => feedbackStorage.submitFeedback(submission),

  getFeedback: (page?: number, pageSize?: number, filters?: FeedbackFilters) =>
    feedbackStorage.getFeedback(page, pageSize, filters),

  getFeedbackCount: () => feedbackStorage.getFeedbackCount(),
};
