# Info
JQ is a command line query tool to process json data

# Usage

- Basic Usage
`echo '{"foo": "bar"}' | jq `

- Get a value for a specific field
`jq '.field_name'`

- Get values in a array
`jq '.[start:end]'`
Eg.
    - `.[0]` first value 
    - `.[1:2]` range value (`:2` `2:` `:-1`) these all operation also works

- Can do operation on array
`jq '.field.[].subfield'`

- can use flag to unwrap ( "1" -> 1 )
`jq -r '<query>'`

- To give raw text input which is not json
`jq -R '<query>'`

- To select value in a array which match a condition
`jq -r '.messages | map(select(.subtype == "bot_message"))'`

- Construct array from the output
`jq '[.messages | map(select(.username == "Call Analysis")) | .[].attachments.[].fields.[].value]'`

- Can do operation on strings
`jq '[.messages | map(select(.username == "Call Analysis")) | .[].attachments.[].fields.[].value] | map(split("\n")[:2])'`

- To get unique value from file of line
`jq -r -R -s 'split("\n") | unique | .[]' > unique_transcript_links`

- convert hash to entries and perform operation on value then convert back
`jq 'to_entries | map({key: .key, value: .value.confidence}) | from_entries'
`


Refs: 


202407242347
