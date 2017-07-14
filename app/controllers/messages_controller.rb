class MessagesController < ApplicationController

  def create
    Message.create(
      username: params['username'].gsub("\n", '').strip,
      message: params['message']
    )
    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  def export_to_xml
    Message.export_to_xml
    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  def export_to_json
    Message.export_to_json
    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end
      
end  
