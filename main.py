import os
import subprocess
import json
import openai

# Set your GitHub repository URL and local directory for cloning
REPO_URL = 'https://github.com/yourusername/your-repo.git'  # Replace with your GitHub repo
LOCAL_DIR = 'path/to/local/dir'  # Replace with your desired local directory
OPENAI_API_KEY = 'your_openai_api_key'  # Replace with your OpenAI API key

# Function to clone the GitHub repository if it doesn't exist
def clone_repository(repo_url, local_dir):
    if not os.path.exists(local_dir):
        print(f"Cloning repository from {repo_url} to {local_dir}...")
        subprocess.run(['git', 'clone', repo_url, local_dir])
    else:
        print(f"Repository already exists at {local_dir}.")

# Function to read .rego policy files and prepare JSON data
def read_policy_files(directory):
    policies = []
    
    for filename in os.listdir(directory):
        if filename.endswith('.rego'):
            with open(os.path.join(directory, filename), 'r') as file:
                policy_content = file.read()
                policies.append({
                    "service": filename.split('.')[0],  # Extract service name from filename
                    "policy": policy_content,
                    "compliance_standard": "NIST"  # Example metadata
                })
    
    return policies

# Function to save policies to a JSON file
def save_policies_to_json(policies, output_file='policies.json'):
    with open(output_file, 'w') as json_file:
        json.dump(policies, json_file, indent=4)
    print(f"Policies saved to {output_file}.")

# Function to generate a policy based on a prompt
def generate_policy(prompt):
    # Set the OpenAI API key
    openai.api_key = OPENAI_API_KEY
    
    try:
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',  # Replace with your fine-tuned model name if applicable
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error generating policy: {e}")
        return None

# Main function to execute the script
def main():
    # Step 1: Clone the repository
    clone_repository(REPO_URL, LOCAL_DIR)

    # Step 2: Read the policy files and prepare the dataset
    policies = read_policy_files(LOCAL_DIR)

    # Step 3: Save the policies to a JSON file
    save_policies_to_json(policies)

    # Example usage: Generate a policy based on a user-defined prompt
    prompt = "Generate security group OPA policy for EC2."  # Change the prompt as needed
    generated_policy = generate_policy(prompt)
    
    if generated_policy:
        print("Generated Policy:")
        print(generated_policy)

if __name__ == "__main__":
    main()
