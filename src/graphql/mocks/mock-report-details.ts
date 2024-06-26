export const mockReportDetails = {
  messages: [
    ...Array.from({ length: 50 }).map((_, index) => ({
      reportId: '1',
      messageId: 30 + index,
      title: `Additional message ${index + 1}`,
      activeCount: 5,
      equalifiedCount: 2,
      totalCount: 7,
      tags: ['1', '2'].filter(() => Math.random() > 0.5),
    })),
    {
      reportId: '1',
      messageId: 14,
      title: 'Element has insufficient color contrast',
      activeCount: 20,
      equalifiedCount: 5,
      totalCount: 25,
      tags: ['1'],
    },
    {
      reportId: '2',
      messageId: 15,
      title: 'Images missing alt attributes',
      activeCount: 15,
      equalifiedCount: 2,
      totalCount: 17,
      tags: ['2']
    },
    {
      reportId: '2',
      messageId: 16,
      title: 'Document does not have a lang attribute',
      activeCount: 10,
      equalifiedCount: 1,
      totalCount: 11,
      tags: ['2', '3']
    },
    {
      reportId: '3',
      messageId: 17,
      title: 'Missing title element',
      activeCount: 5,
      equalifiedCount: 0,
      totalCount: 5,
      tags: ['3']
    },
    {
      reportId: '3',
      messageId: 18,
      title: 'Input fields missing labels',
      activeCount: 7,
      equalifiedCount: 2,
      totalCount: 9,
      tags: ['3', '4']
    },
    {
      reportId: '4',
      messageId: 19,
      title: 'Missing document headers',
      activeCount: 12,
      equalifiedCount: 4,
      totalCount: 16,
      tags: ['4']
    },
    {
      reportId: '4',
      messageId: 20,
      title: 'Flash content without textual equivalents',
      activeCount: 9,
      equalifiedCount: 1,
      totalCount: 10,
      tags: ['4', '5']
    },
    {
      reportId: '5',
      messageId: 21,
      title: 'Old HTML doctype, causing quirks mode',
      activeCount: 14,
      equalifiedCount: 6,
      totalCount: 20,
      tags: ['5']
    },
    {
      reportId: '5',
      messageId: 22,
      title: 'Scripts loaded synchronously blocking rendering',
      activeCount: 18,
      equalifiedCount: 7,
      totalCount: 25,
      tags: ['5', '6']
    },
    {
      reportId: '6',
      messageId: 23,
      title: 'Frames without title attributes',
      activeCount: 7,
      equalifiedCount: 3,
      totalCount: 10,
      tags: ['6']
    },
    {
      reportId: '6',
      messageId: 24,
      title: 'Clickable elements too close together',
      activeCount: 10,
      equalifiedCount: 5,
      totalCount: 15,
      tags: ['6', '7']
    },
  ],
  pages: [
    ...Array.from({ length: 20 }).map((_, index) => ({
      reportId: '1',
      pageId: 5000 + index,
      url: `https://www.example.com/page${index + 1}`,
      occurrencesActive: index * 2,
    })),
    {
      reportId: '2',
      pageId: 4028,
      url: 'https://www.example.com/page2',
      occurrencesActive: 15,
    },
    {
      reportId: '3',
      pageId: 4029,
      url: 'https://www.example.com/page3',
      occurrencesActive: 7,
    },
    {
      reportId: '4',
      pageId: 4030,
      url: 'https://www.example.com/page4',
      occurrencesActive: 12,
    },
    {
      reportId: '5',
      pageId: 4031,
      url: 'https://www.example.com/page5',
      occurrencesActive: 14,
    },
    {
      reportId: '6',
      pageId: 4032,
      url: 'https://www.example.com/page6',
      occurrencesActive: 10,
    },
  ],
  tags: [
    ...Array.from({ length: 20 }).map((_, index) => ({
      reportId: '1',
      tagId: 1 + index,
      name: `Tag ${index + 1}`,
      referenceCount: index * 2,
    })),
    { reportId: '2', tagId: 21, name: 'WCAG2A', referenceCount: 15 },
    { reportId: '3', tagId: 22, name: 'WCAG2AA', referenceCount: 7 },
    { reportId: '4', tagId: 23, name: 'WCAG2AAA', referenceCount: 12 },
    { reportId: '5', tagId: 24, name: 'Section508', referenceCount: 14 },
    {
      reportId: '6',
      tagId: 25,
      name: 'HTML5_Accessibility',
      referenceCount: 10,
    },
  ],
};
