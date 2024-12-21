# routes/audit_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from database.database import Session as DBSession
from models.audit_log import AuditLog
from models.user import User
from utils.audit_logger import log_event
from sqlalchemy.sql.sqltypes import Date

audit_bp = Blueprint('audit', __name__)

@audit_bp.route('/audit_logs', methods=['GET'])
@login_required
def get_audit_logs():

    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 50))
    filter_date = request.args.get("date")
    filter_type = request.args.get("type", "").split(",")

    db_session = DBSession()

    try:
        query = db_session.query(AuditLog).order_by(AuditLog.timestamp.desc())
    except Exception as e:
        return jsonify({"error": str(e)}), 318

    if filter_date:
        query = query.filter(AuditLog.timestamp.cast(Date) == filter_date)

    if filter_type and filter_type != [""]:
        query = query.filter(AuditLog.event_type.in_(filter_type))

    total_logs = query.count()

    logs = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify({
        "logs": [log.as_dict() for log in logs],
        "totalPages": (total_logs + page_size - 1) // page_size,
    }), 200


@audit_bp.route('/audit_log_types', methods=['GET'])
@login_required
def get_audit_log_types():
    db_session = DBSession()
    try:
        event_types = db_session.query(AuditLog.event_type).distinct().all()

        event_types_list = [event_type[0] for event_type in event_types]

        return jsonify(event_types_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()