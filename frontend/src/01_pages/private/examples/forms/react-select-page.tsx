import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import PageHeader from '@/components/typography/page-header';
import PageSubHeader from '@/components/typography/page-sub-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { timezones } from '@/data/timezones';
import { convertToGroupedSelectOptions } from '@/lib/react-select/convert-to-grouped-select-options';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
  item: z.object(
    {
      label: z.string(),
      value: z.any(),
    },
    {
      message: 'Required',
    },
  ),
});

const FormSchemaMultiple = z.object({
  items: z
    .array(
      z.object({
        label: z.string(),
        value: z.any(),
      }),
    )
    .min(1, { message: 'Required' }),
});

const InputPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: undefined,
    },
  });

  const formMultiple = useForm<z.infer<typeof FormSchemaMultiple>>({
    resolver: zodResolver(FormSchemaMultiple),
    defaultValues: {
      items: [],
    },
  });

  function onSubmit(_data: z.infer<typeof FormSchema>) {
    toast.success('Success!');
  }

  function onSubmitMultiple(_data: z.infer<typeof FormSchemaMultiple>) {
    toast.success('Success!');
  }

  const options = convertToGroupedSelectOptions(timezones);

  return (
    <>
      <PageHeader className="mb-layout">React Select</PageHeader>

      <PageSubHeader>Single</PageSubHeader>
      <CodePreview
        code={codeString}
        lineNumbers={[
          18, 19, 20, 27, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        ]}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="gap-layout grid grid-cols-12">
              <FormField
                control={form.control}
                name="item"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <ReactSelect
                        className={cn(
                          'react-select-container',
                          fieldState.invalid ? 'invalid' : '',
                        )}
                        classNamePrefix="react-select"
                        options={options}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-12 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>

      <PageSubHeader>Multiple</PageSubHeader>
      <CodePreview
        code={codeString}
        lineNumbers={[
          18, 19, 20, 27, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        ]}
      >
        <Form {...formMultiple}>
          <form onSubmit={formMultiple.handleSubmit(onSubmitMultiple)}>
            <div className="gap-layout grid grid-cols-12">
              <FormField
                control={formMultiple.control}
                name="items"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <ReactSelect
                        className={cn(
                          'react-select-container',
                          fieldState.invalid ? 'invalid' : '',
                        )}
                        classNamePrefix="react-select"
                        options={options}
                        value={field.value}
                        onChange={field.onChange}
                        isMulti
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-12 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>
    </>
  );
};

export default InputPage;

const codeString = ``.trim();
