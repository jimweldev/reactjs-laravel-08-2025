import { AxiosError } from 'axios';
import { AsyncPaginate, type LoadOptions } from 'react-select-async-paginate';
import { toast } from 'sonner';
import type { ReactSelectOption } from '@/04_types/_common/react-select-option';
import { type RbacPermission } from '@/04_types/rbac/rbac-permission';
import { mainInstance } from '@/07_instances/main-instance';

const PermissionSelect = ({ ...props }) => {
  const loadOptions: LoadOptions<
    ReactSelectOption,
    never,
    { page: number }
  > = async (searchQuery, _loadedOptions, additional = { page: 1 }) => {
    const page = additional.page || 1;

    try {
      const response = await mainInstance.get(
        `/select/permissions?page=${page}&search=${searchQuery}&sort=label`,
      );

      const options = response.data.records.map((role: RbacPermission) => ({
        value: role.id,
        label: role.label,
      }));

      return {
        options,
        hasMore: response.data.meta.total_pages > page,
        additional: {
          page: page + 1,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || error.message || 'An error occurred',
        );
      } else {
        toast.error('An unknown error occurred');
      }

      return {
        options: [],
        hasMore: false,
      };
    }
  };

  return (
    <AsyncPaginate
      className="react-select-container"
      classNamePrefix="react-select"
      loadOptions={loadOptions}
      debounceTimeout={200}
      additional={{
        page: 1,
      }}
      closeMenuOnSelect={!props.isMulti}
      {...(props.isMulti && {
        filterOption: (candidate: ReactSelectOption) => {
          const selectedValues = (props.value || []).map(
            (item: ReactSelectOption) => item.value,
          );
          return !selectedValues.includes(candidate.value);
        },
      })}
      {...props}
    />
  );
};

export default PermissionSelect;
