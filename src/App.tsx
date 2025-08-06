import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Form from "@/components/Form/Form";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ color: "red", margin: "1em 0" }}>{message}</div>
);

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const [postCode, setPostCode] = React.useState("");
  const [houseNumber, setHouseNumber] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPostCode(e.target.value);

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHouseNumber(e.target.value);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );
      const data = await res.json();

      if (data.status === "ok") {
        const results = data.details.map((addr: AddressType) => ({
          ...addr,
          houseNumber: houseNumber, // transformAddress
        }));

        setAddresses(results);
      } else {
        setError(data.errormessage);
      }
    } catch (err) {
      setError("Failed to fetch addresses.");
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section key={"first section"}>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label="🏠 Find an address"
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                onChange: handlePostCodeChange,
                value: postCode,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                onChange: handleHouseNumberChange,
                value: houseNumber,
              },
            },
          ]}
          loading={false}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address, index) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id || `${address.street}-${index}`}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  onChange: handleFirstNameChange,
                  value: firstName,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  onChange: handleLastNameChange,
                  value: lastName,
                },
              },
            ]}
            loading={false}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}

        <Button
          variant="secondary"
          onClick={() => {
            setPostCode("");
            setHouseNumber("");
            setFirstName("");
            setLastName("");
            setSelectedAddress("");
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>

      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
