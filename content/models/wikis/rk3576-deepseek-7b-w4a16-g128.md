  # DeepSeek-R1-Distill-Qwen:7B-W4A16-G128-Latest
  ## Introduction
   DeepSeek-R1-Distill-Qwen:7B-W4A16-G128 is a lightweight yet powerful large language model optimized for efficient reasoning and deployment. It is distilled from DeepSeek’s R1 series and built on the Qwen-7B backbone, inheriting strong capabilities in logical reasoning, mathematics, coding, and multilingual understanding, especially in Chinese. With W4A16 mixed-precision quantization and G128 group-wise compression, the model significantly reduces memory usage while maintaining high inference accuracy and stability, making it suitable for local deployment, edge computing, and cost-effective AI applications.
  ## Fast Begin
  ### Install Docker
  ```code
  curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh 
  ```
  ### Run on reComputer RK3576

  ```docker
  docker run -it \
          --privileged \
          --net=host \
          --device /dev/dri \
          --device /dev/dma_heap \
          --device /dev/rknpu \  
          --device /dev/mali0 \
          -v /dev:/dev \
          ghcr.io/lj-hao/rk3576-deepseek-r1-distill-qwen:7b-w4a16-g128-latest
  ```
  ### API Test

  #### Command Line Test
  Non-streaming response：
  ```bash
  curl http://127.0.0.1:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "rkllm-model",
    "messages": [
      {"role": "user", "content": "Where is the capital of China？"}
    ],
    "temperature": 1,
    "max_tokens": 512,
    "top_k": 1,
    "stream": false
  }'
  ```
  Streaming response：
  ```bash
  curl -N http://127.0.0.1:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "rkllm-model",
    "messages": [
      {"role": "user", "content": "Where is the capital of China？"}
    ],
    "temperature": 1,
    "max_tokens": 512,
    "top_k": 1,
    "stream": true
  }'
  ```

  ####  OpenAI API Test
  You can also use OpenAI API compatible SDKs to call the model, such as OpenAI Python SDK:
  Non-streaming response：
  ```python
  import openai

  # Configure the OpenAI client to use your local server
  client = openai.OpenAI(
      base_url="http://localhost:8001/v1",  # Point to your local server
      api_key="dummy-key"  # The API key can be anything for this local server
  )

  # Test the API
  response = client.chat.completions.create(
      model="rkllm-model",
      messages=[
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Where is the capital of China？"}
      ],
      temperature=0.7,
      max_tokens=512
  )

  print(response.choices[0].message.content)
  ```
  Streaming response:
  ```python
  import openai
  # Configure the OpenAI client to use your local server
  client = openai.OpenAI(
      base_url="http://localhost:8001/v1",  # Point to your local server
      api_key="dummy-key"  # The API key can be anything for this local server
  )

  # Test the API with streaming
  response_stream = client.chat.completions.create(
      model="rkllm-model",
      messages=[
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Where is the capital of China？"}
      ],
      temperature=0.7,
      max_tokens=512,
      stream=True  # Enable streaming
  )

  # Process the streaming response
  for chunk in response_stream:
      if chunk.choices[0].delta.content is not None:
          print(chunk.choices[0].delta.content, end="", flush=True)
  ```