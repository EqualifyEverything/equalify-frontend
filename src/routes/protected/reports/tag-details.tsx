import { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { useTagDetails } from '~/graphql/hooks/useTagDetails';
import { Message } from '~/graphql/types';

const TagDetails = () => {
  const { tagId = '', reportId = '' } = useParams();
  const { data, error } = useTagDetails(tagId, reportId);
  if (error) return <div role="alert">Error loading tag details.</div>;

  const timelineData = [
    { date: '2021/01', equalified: 10, active: 5, ignored: 2 },
    { date: '2021/02', equalified: 15, active: 7, ignored: 3 },
    { date: '2021/03', equalified: 20, active: 10, ignored: 5 },
    { date: '2021/04', equalified: 25, active: 12, ignored: 6 },
    { date: '2021/05', equalified: 30, active: 15, ignored: 7 },
  ];

  const messageColumns: ColumnDef<Message>[] = [
    {
      accessorKey: 'title',
      header: 'Message',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/messages/${row.original.messageId}`}
          className="underline"
        >
          {row.getValue('title')}
        </Link>
      ),
    },
    { accessorKey: 'equalifiedCount', header: 'Equalified' },
    { accessorKey: 'activeCount', header: 'Active' },
    { accessorKey: 'totalCount', header: 'Total' },
  ];
  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.tagName} - Tag Details - Equalify`}
        description={`View the details of the ${data?.tagName} tag, including associated messages, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}/tags/${tagId}`}
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <div>
          <Link to={`/reports/${reportId}`} className="hover:underline">
            <h1
              id="report-details-heading"
              className="text-2xl font-bold md:text-3xl"
            >
              {data?.reportName}
            </h1>
          </Link>
          <p className="text-lg text-gray-500">{data?.tagName}</p>
        </div>
        <Link
          to={`/reports/${reportId}/edit`}
          className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap  rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
        >
          Edit Report
        </Link>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-8">
        <Timeline data={timelineData} />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <DataTable
          columns={messageColumns}
          data={data?.messages || []}
          type="messages"
        />
      </div>
    </div>
  );
};

export default TagDetails;
