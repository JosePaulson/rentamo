import PropertyAddForm from "@/components/PropertyAddForm";
const AddPropertyPage = ({ searchParams }) => {
  return (
    <section className='bg-blue-50'>
      <div className='max-w-2xl py-24 m-auto '>
        <div className='px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0'>
          <PropertyAddForm state={JSON.parse(searchParams.data ?? null)} />
        </div>
      </div>
    </section>
  );
};
export default AddPropertyPage;