require 'nokogiri'
class Message < ApplicationRecord

  def self.export_to_xml
      builder = Nokogiri::XML::Builder.new do |xml|
        xml.root {
          xml.messages {
            Message.all.each do |message|
              xml.message {
                xml.username message.username
                xml.message message.message
                xml.created_at message.created_at
              }
            end  
          }
        }
    end    
    IO.write('tmp/archive.xml', builder.to_xml)
  end

  def self.export_to_json
    archive = Message.all.map { |message| { 
      username: message.username, 
      message: message.message, 
      created_at: message.created_at 
    } }
    IO.write('tmp/archive.json', archive.to_json)
  end    
end
