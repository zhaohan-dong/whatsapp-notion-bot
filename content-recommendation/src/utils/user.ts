class User {
    private id: number;
    private firstName: string;
    private lastName: string;
    private email: string | undefined;

    constructor(id: number, firstName: string, lastName: string, email: string|undefined) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.setEmail(email); // Using a method to ensure the email follows certain validation rules
    }

    // Getter for ID (typically, you'd not have a setter for ID as it shouldn't change)
    getId(): number {
        return this.id;
    }

    // Other methods including behaviors, like setEmail, which might have validations
    setEmail(newEmail: string | undefined): void {
         // TODO: Some validation function
        if (newEmail !== undefined) {
            this.email = newEmail;
        }
    }
}
