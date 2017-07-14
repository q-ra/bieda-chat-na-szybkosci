Rails.application.routes.draw do
  post 'messages/create', to: 'messages#create'
  post 'messages/export_to_xml', to: 'messages#export_to_xml'
  post 'messages/export_to_json', to: 'messages#export_to_json'
end
