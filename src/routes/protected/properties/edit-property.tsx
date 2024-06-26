import { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { propertyQuery } from '~/queries/properties';
import { deleteProperty, updateProperty } from '~/services/properties';
import { assertNonNull } from '~/utils/safety';
import { LoadingProperty } from './loading';

/**
 * Loader function to fetch property data
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const propertyLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    assertNonNull(
      params.propertyId,
      'Property ID is missing in the route parameters',
    );

    const initialProperty = await queryClient.ensureQueryData(
      propertyQuery(params.propertyId),
    );
    return { initialProperty, propertyId: params.propertyId };
  };

/**
 * Handles updating a property.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const updatePropertyAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    assertNonNull(params.propertyId, 'No property ID provided');

    try {
      const formData = await request.formData();
      const propertyName = formData.get('propertyName') as string;
      const sitemapUrl = formData.get('sitemapUrl') as string;

      const response = await updateProperty(
        params.propertyId,
        propertyName,
        sitemapUrl,
      );

      await queryClient.invalidateQueries({
        queryKey: ['property', params.propertyId],
      });
      await queryClient.invalidateQueries({ queryKey: ['properties'] });

      if (response.status === 'success') {
        toast.success('Property updated successfully!');
        return redirect(`/properties`);
      } else {
        toast.error('Failed to update property.');
        throw new Response('Failed to update property', { status: 500 });
      }
    } catch (error) {
      toast.error('An error occurred while updating the property.');
      throw error;
    }
  };

const EditProperty = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { initialProperty, propertyId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof propertyLoader>>
  >;

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: property, isLoading } = useQuery({
    ...propertyQuery(propertyId!),
    initialData: initialProperty,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => deleteProperty(propertyId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully!');
      navigate('/properties');
    },
    onError: () => {
      toast.error('Failed to delete property.');
    },
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'propertyName' && value.trim() !== property?.name.trim()) {
      setIsFormChanged(true);
    } else if (
      name === 'sitemapUrl' &&
      value.trim() !== property?.sitemapUrl.trim()
    ) {
      setIsFormChanged(true);
    } else {
      setIsFormChanged(false);
    }
  };

  const handleDeleteProperty = async () => {
    setIsDeleteDialogOpen(false);
    deleteMutate();
  };

  return (
    <>
      <SEO
        title={`Edit ${property?.name || 'Property'} - Equalify`}
        description={`Edit the details of ${property?.name || 'this property'} on Equalify.`}
        url={`https://www.equalify.dev/properties/${propertyId}/edit`}
      />
      <h1 id="edit-property-heading" className="text-2xl font-bold md:text-3xl">
        Edit {property?.name || 'Property'}
      </h1>

      <section
        aria-labelledby="edit-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        {isLoading ? (
          <LoadingProperty />
        ) : (
          <PropertyForm
            actionUrl={`/properties/${propertyId}/edit`}
            defaultValues={{
              propertyName: property?.name || '',
              sitemapUrl: property?.sitemapUrl || '',
              propertyDiscovery: 'manually_added',
            }}
            formId="edit-property-form"
            onChange={handleFormChange}
          />
        )}

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate('/properties')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-property-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormChanged}
            aria-disabled={!isFormChanged}
            aria-live="polite"
          >
            Update Property
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="gap-2 bg-[#cf000f]"
          aria-describedby="delete-property-description"
        >
          Delete Property
          <ExclamationTriangleIcon aria-hidden />
        </Button>
        <p
          id="delete-property-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your property is irreversible. Please proceed with caution.
        </p>

        {isDeleteDialogOpen && (
          <DangerDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteProperty}
            title="Confirm Property Deletion"
            description="Are you sure you want to delete your property? This action cannot be undone."
          />
        )}
      </section>
    </>
  );
};

export default EditProperty;
